---
title: "MCAP: a serialization-agnostic log container"
url: "https://mcap.dev/"
source: "Foxglove"
pubDate: 2026-10-13
---

Worth reading if you are still on rosbag2's sqlite3 backend. The indexed,
chunked layout means you can seek into a multi-gigabyte recording without
decompressing the whole thing — which matters a lot once you are shipping
compressed video topics alongside joint states.
