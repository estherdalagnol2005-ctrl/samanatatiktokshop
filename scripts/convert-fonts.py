"""Lossless WOFF2 packaging. Uses the already available Node Brotli codec."""
import subprocess
import sys
import types

codec = types.ModuleType("brotli")
codec.MODE_FONT = 2

def compress(data, mode=2):
    script = "const z=require('node:zlib');const chunks=[];process.stdin.on('data',c=>chunks.push(c));process.stdin.on('end',()=>process.stdout.write(z.brotliCompressSync(Buffer.concat(chunks),{params:{[z.constants.BROTLI_PARAM_MODE]:2,[z.constants.BROTLI_PARAM_QUALITY]:11}})));"
    return subprocess.run(["node", "-e", script], input=data, stdout=subprocess.PIPE, check=True).stdout

def decompress(data):
    script = "const z=require('node:zlib');const chunks=[];process.stdin.on('data',c=>chunks.push(c));process.stdin.on('end',()=>process.stdout.write(z.brotliDecompressSync(Buffer.concat(chunks))));"
    return subprocess.run(["node", "-e", script], input=data, stdout=subprocess.PIPE, check=True).stdout

codec.compress = compress
codec.decompress = decompress
sys.modules["brotli"] = codec
from fontTools.ttLib import TTFont

for filename in ["nagoku-black.otf", "tiktok-sans-variable.ttf"]:
    source = "public/brand/" + filename
    target = source.rsplit(".", 1)[0] + ".woff2"
    font = TTFont(source)
    font.flavor = "woff2"
    font.save(target)
    restored = TTFont(target)
    assert restored.getBestCmap() == font.getBestCmap()
    assert restored.getGlyphOrder() == font.getGlyphOrder()
    print(target)
