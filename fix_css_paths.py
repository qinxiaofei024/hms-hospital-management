import os
import re

# 获取pages目录下的所有HTML文件
pages_dir = "pages"
html_files = []

for root, dirs, files in os.walk(pages_dir):
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

print(f"找到 {len(html_files)} 个HTML文件")

# 修复每个文件中的CSS路径
for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 替换CSS文件路径
        original_content = content
        content = re.sub(r'href="\.\/css\/', 'href="../css/', content)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"已修复: {file_path}")
        else:
            print(f"无需修复: {file_path}")
            
    except Exception as e:
        print(f"处理文件 {file_path} 时出错: {e}")

print("CSS路径修复完成！")