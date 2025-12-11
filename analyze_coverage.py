
import os
import json

def analyze_data():
    questions_dir = 'alfie_exam_data/questions'
    total = 0
    filled_domains = 0
    filled_subdomains = 0
    
    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.startswith('q') and file.endswith('.json'):
                total += 1
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        data = json.load(f)
                        curriculum = data.get('metadata', {}).get('curriculum', {})
                        
                        if curriculum.get('domains'):
                            filled_domains += 1
                            
                        if curriculum.get('subdomains'):
                            filled_subdomains += 1
                except Exception as e:
                    print(f"Error reading {file}: {e}")
                    
    print(f"Total Questions: {total}")
    print(f"Filled Domains: {filled_domains}")
    print(f"Filled Subdomains: {filled_subdomains}")
    print(f"Domain %: {(filled_domains/total)*100:.2f}%")
    print(f"Subdomain %: {(filled_subdomains/total)*100:.2f}%")

if __name__ == "__main__":
    analyze_data()
