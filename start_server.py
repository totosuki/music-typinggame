#!/usr/bin/env python3
"""
音声タイピングゲームサーバー起動スクリプト
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🎮 音声タイピングゲームサーバーを起動中...")
    print("📖 ブラウザで http://localhost:8000 にアクセスしてください")
    print("🛑 サーバーを停止するには Ctrl+C を押してください")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # 開発モード
    )