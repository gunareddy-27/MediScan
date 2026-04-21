import os
import re

directory = 'templates'
for filename in os.listdir(directory):
    if filename.endswith('.html') and filename != 'footer.html':
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Regex to find the footer block with comment
        new_content = re.sub(
            r'<!-- 🏆 Elite Global Neural Footer -->\s*<footer class=\"site-footer\">.*?</footer>',
            '{% include \'footer.html\' %}',
            content,
            flags=re.DOTALL
        )
        
        if content != new_content:
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Updated {filename}')
        else:
            # Try without the comment
            new_content2 = re.sub(
                r'<footer class=\"site-footer\">.*?</footer>',
                '{% include \'footer.html\' %}',
                content,
                flags=re.DOTALL
            )
            if content != new_content2:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content2)
                print(f'Updated {filename} (no comment)')
            else:
                print(f'No footer found in {filename}')
