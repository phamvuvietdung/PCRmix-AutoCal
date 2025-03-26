import os
import json
import pandas as pd

# Định nghĩa thư mục chứa CSV và JSON
DATABASE_FOLDER = "database"
OUTPUT_FOLDER = "static/data"

# Đảm bảo thư mục đầu ra tồn tại
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

# Lấy danh sách các file CSV và loại bỏ phần mở rộng ".csv"
list_database = [f.replace(".csv", "") for f in os.listdir(DATABASE_FOLDER) if f.endswith(".csv")]

# Lưu danh sách vào file JSON
list_json_path = os.path.join(OUTPUT_FOLDER, "list.json")
with open(list_json_path, "w", encoding="utf-8") as f:
    json.dump(list_database, f, ensure_ascii=False, indent=4)

# Chuyển từng file CSV sang JSON
for file in list_database:
    csv_path = os.path.join(DATABASE_FOLDER, f"{file}.csv")
    json_path = os.path.join(OUTPUT_FOLDER, f"{file}.json")

    try:
        # Đọc file CSV
        df = pd.read_csv(csv_path)
        
        # Thay thế NaN bằng chuỗi rỗng để tránh lỗi khi chuyển sang JSON
        df = df.fillna("")

        # Chuyển đổi sang JSON
        df.to_json(json_path, orient="records", force_ascii=False, indent=4)
        print(f"✅ Đã tạo {json_path}")
    
    except Exception as e:
        print(f"❌ Lỗi khi xử lý {file}: {e}")

print("🎉 Hoàn tất chuyển đổi CSV sang JSON!")
