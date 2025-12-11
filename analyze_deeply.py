
import os
import json

def analyze_deeply():
    questions_dir = 'alfie_exam_data/questions'
    
    # 1. Count via Metadata Sum
    metadata_total_questions = 0
    exam_folders = [f for f in os.listdir(questions_dir) if os.path.isdir(os.path.join(questions_dir, f))]
    
    print(f"Found {len(exam_folders)} exam folders.")
    
    for folder in exam_folders:
        meta_path = os.path.join(questions_dir, folder, 'metadata.json')
        if os.path.exists(meta_path):
            try:
                with open(meta_path, 'r') as f:
                    meta = json.load(f)
                    count = meta.get('question_count', 0)
                    metadata_total_questions += count
            except Exception as e:
                print(f"Error reading {meta_path}: {e}")
    
    print(f"Total Questions (Sum of metadata.question_count): {metadata_total_questions}")

    # 2. Count via File Iteration & Overlap Analysis
    file_count = 0
    has_explicit_domain = 0
    has_subdomain = 0
    has_either = 0 # This represents the true "Classified" count in the tree
    
    # Check for implicit domains (Has subdomain but NO domain)
    implicit_domain_count = 0

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.startswith('q') and file.endswith('.json'):
                file_count += 1
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        data = json.load(f)
                        curriculum = data.get('metadata', {}).get('curriculum', {})
                        
                        doms = curriculum.get('domains', [])
                        subdoms = curriculum.get('subdomains', [])
                        
                        has_d = len(doms) > 0
                        has_s = len(subdoms) > 0
                        
                        if has_d: has_explicit_domain += 1
                        if has_s: has_subdomain += 1
                        
                        if has_d or has_s:
                            has_either += 1
                        
                        if has_s and not has_d:
                            implicit_domain_count += 1
                            
                except Exception as e:
                    pass

    print(f"Total Questions (File count): {file_count}")
    print(f"Questions with Explicit Domains: {has_explicit_domain} ({(has_explicit_domain/file_count)*100:.1f}%)")
    print(f"Questions with Subdomains: {has_subdomain} ({(has_subdomain/file_count)*100:.1f}%)")
    print(f"Questions with Implicit Domains (Subdomain but no Domain): {implicit_domain_count}")
    print(f"Total Classified Questions (Has Domain OR Subdomain): {has_either} ({(has_either/file_count)*100:.1f}%)")
    print(f"Unclassified Questions: {file_count - has_either}")

if __name__ == "__main__":
    analyze_deeply()
