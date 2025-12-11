# BrainBooster Exam Content Dataset

**Export Date**: 2025-12-09
**Source**: BrainBooster Production API (https://api.app.brainboost.nl)
**Purpose**: Reference data for Alfie question generation model

---

## 📊 Dataset Overview

This dataset contains complete exam question content from the Dutch secondary education system (CITO exams), structured for machine learning and question generation analysis.

**Contents**:

- **4,316 exam questions** from 133 exams (2021-2025)
- **973 in-exam media files** (images, graphs, diagrams)
- **150 bijlages** (official exam appendices - PDFs)
- **90 solution images** (worked solutions for self-scored questions)
- **Complete curriculum mappings** (domains, subdomains, learning objectives)

**Education Levels**: VWO, HAVO, VMBO (BB, KB, GL, TL)
**Disciplines**: Biology, Chemistry, Physics, Economics, Geography, Mathematics, Languages, etc.
**Years**: 2021-2025 (all available CITO exams in production)

---

## 📁 Archive Structure

```
brainbooster-exam-data/
├── README.md                    # This file
├── metadata.json                # Export metadata and statistics
│
├── questions/                   # All exam questions (organized by exam)
│   ├── vwo_biologie_2024_t1/
│   │   ├── metadata.json        # Exam metadata (year, period, question count)
│   │   ├── q001.json
│   │   ├── q002.json
│   │   └── ...
│   ├── havo_economie_2023_t1/
│   └── ... (133 exam folders)
│
├── media/                       # All media files
│   ├── in-exam/                 # Shared context images (973 files)
│   │   ├── img_a3f5b2c1.png    # Hash-based filenames for deduplication
│   │   └── ...
│   ├── solution_images/         # Solution images (90 files)
│   │   ├── sol_d8e2f1a3.png
│   │   └── ...
│   └── bijlages/                # Official exam appendices (150 PDFs)
│       ├── Biologie_2024_I_bijlage_*.pdf
│       ├── vwo_wiskunde_a_formules_*.pdf
│       └── ...
│
└── curriculum/                  # Dutch curriculum structure
    ├── education_level_disciplines.json  # All ED combinations (121 entries)
    └── disciplines/
        ├── vwo_biologie.json    # Complete curriculum per discipline
        ├── havo_economie.json   # (domains → subdomains → LOs → SubLOs)
        └── ... (per discipline)
```

---

## 📄 Question JSON Structure

Each question file (`q001.json`, etc.) contains complete information:

```json
{
  "id": "vwo_biologie_2024_t1_q01",

  "metadata": {
    "exam": {
      "education_level": "vwo",
      "discipline": "biologie",
      "year": 2024,
      "tijdvak": 1
    },
    "curriculum": {
      "education_level_discipline_id": 5,
      "domains": [
        {
          "id": 13,
          "name": "Vaardigheden",
          "prefix_code": "A"
        }
      ],
      "subdomains": [
        {
          "id": 24,
          "name": "Vorm-functie denken",
          "prefix_code": 11
        }
      ],
      "sub_learning_objective_ids": []
    }
  },

  "question": {
    "text": "<p>Question text with MathML: <math>...</math></p>",
    "max_score": 3,
    "is_self_scored": false
  },

  "solution": {
    "text": "maximumscore 3\n\n• First scoring element 1\n• Second element 1\n...",
    "image": null,
    "azure_url": null
  },

  "content_context": [
    {
      "order": 0,
      "type": "text",
      "text": "<p>Shared context text...</p>"
    },
    {
      "order": 1,
      "type": "image",
      "media_path": "media/in-exam/img_a3f5b2c1.png",
      "azure_url": "https://bbprodpublicsa.blob.core.windows.net/public/...",
      "caption": "Figure 1"
    }
  ],

  "bijlages": [
    {
      "name": "Kaartenkatern",
      "media_path": "media/bijlages/Biologie_2024_I_bijlage_*.pdf",
      "azure_url": "https://bbprodpublicsa.blob.core.windows.net/public/..."
    }
  ]
}
```

### Key Fields Explained

**Curriculum Links**:

- `domains`: Broad subject areas (e.g., "Vaardigheden", "Markten")
- `subdomains`: Specific topics within domains (e.g., "Vraag en aanbod")
- `sub_learning_objective_ids`: Specific learning goals (many exam questions lack this)

**Content Context**:

- Shared material referenced by multiple questions (graphs, images, intro text)
- Each question embeds its complete context (not referenced by ID)
- Order field indicates display sequence

**Media References**:

- `media_path`: Relative path within this archive
- `azure_url`: Original Azure Storage URL (fallback if local file missing)

**Solution Format**:

- Dutch CITO standard: "maximumscore X" followed by scoring elements
- Some questions have solution images (self-scored, primarily mathematics)

---

## 🔗 How Data is Linked

### Questions → Media

**In-exam media** (images, graphs):

```json
"content_context": [
  {
    "type": "image",
    "media_path": "media/in-exam/img_a3f5b2c1.png",
    "azure_url": "https://..."
  }
]
```

**Solution images**:

```json
"solution": {
  "image": "media/solution_images/sol_d8e2f1a3.png",
  "azure_url": "https://..."
}
```

**Bijlages** (exam appendices):

```json
"bijlages": [
  {
    "name": "Kaartenkatern",
    "media_path": "media/bijlages/Biologie_2024_I_bijlage_*.pdf"
  }
]
```

### Questions → Curriculum

Each question links to curriculum via IDs:

```json
"curriculum": {
  "education_level_discipline_id": 5,
  "domains": [{"id": 13, "name": "...", "prefix_code": "A"}],
  "subdomains": [{"id": 24, "name": "...", "prefix_code": 11}]
}
```

**Lookup full curriculum structure**:

1. Use `education_level_discipline_id` to find discipline in `curriculum/education_level_disciplines.json`
2. Load full curriculum tree from `curriculum/disciplines/{level}_{discipline}.json`

### Questions → Exams

Questions are organized in exam folders:

- Folder name: `{level}_{discipline}_{year}_t{period}`
- Each folder has `metadata.json` with exam info
- Questions numbered sequentially: `q001.json`, `q002.json`, etc.

---

## 📐 Media File Naming

**In-exam media**: `img_{hash}.{ext}`

- Hash = first 12 chars of SHA256(file content)
- Automatic deduplication (same image = same hash)

**Solution images**: `sol_{hash}.{ext}`

- Same hashing approach
- Primarily PNG and PDF files

**Bijlages**: `{Discipline}_{Year}_{Type}_{hash}.pdf`

- Descriptive naming for exam appendices
- Examples: `Biologie_2024_I_bijlage_*.pdf`, `vwo_wiskunde_a_formules_*.pdf`

---

## 🎓 Understanding Dutch Exam Structure

### Education Levels

- **VWO**: Pre-university (highest level)
- **HAVO**: Senior general secondary education
- **VMBO**: Pre-vocational (BB, KB, GL, TL variants)

### Tijdvakken (Exam Periods)

- `t1` = Tijdvak 1 (May/June)
- `t2` = Tijdvak 2 (Resit, typically August)

### Curriculum Organization

```
EducationLevelDiscipline (e.g., "vwo biologie")
  ↓
Domain (prefix: A, B, C, etc.)
  ↓
Subdomain (prefix: 1-16 within domain)
  ↓
LearningObjective (eindterm)
  ↓
SubLearningObjective (specific learning goal)
```

### Solution Format

Dutch CITO standard uses points-based grading:

```
maximumscore 3

• First scoring element 1
• Second scoring element 1
• Third scoring element 1

Een voorbeeld van een juist antwoord is:
• [Specific example answer] 1
```

---

## 🤖 LLM/ML Usage Notes

### For Training Question Generation Models

**Rich curriculum context**: Each question includes domain, subdomain, and (sometimes) sub-learning objectives - use these to train on appropriate content targeting.

**Complete contextual information**: Questions embed all shared context (images, intro text) - no need to resolve references.

**Dutch exam conventions**: Solutions follow standardized CITO format with explicit point allocation - valuable for training on scoring rubric generation.

**Media diversity**:

- 973 in-exam images (graphs, diagrams, photos)
- Mixed content types (text, image, graph, tables)
- Real exam complexity (not synthetic)

### For Analysis/Research

**Temporal coverage**: 2021-2025 exams show evolution of exam design

**Multi-level data**: Same disciplines across VWO/HAVO/VMBO show difficulty progression

**Curriculum alignment**: Domain/subdomain links enable curriculum coverage analysis

**Question difficulty**: Implicit in `max_score` and education level

### Content Context Patterns

**Shared contexts** appear in multiple questions:

- Graphs referenced by 3-5 questions
- Intro texts for question clusters
- Diagrams used across question sets

Each question JSON contains complete context (duplicated across questions sharing context). This trades storage efficiency for simplicity.

### Missing Data Notes

**SubLearningObjective links**: Most exam questions lack explicit SubLO links in production (empty array). Domain and subdomain links are more complete.

**Solution images**: Only present for some self-scored questions (primarily mathematics). Most questions have text-only solutions.

**Historical data**: Export covers 2021-2025. Earlier exams may exist but weren't in production database at export time.

---

## 📊 Dataset Statistics

See `metadata.json` for complete statistics including:

- Total questions per education level
- Total questions per discipline
- Media file counts by type
- Curriculum coverage (domains, subdomains, SubLOs)
- Years covered per discipline

---

## ✅ Data Quality

**Completeness**:

- ✅ 100% of questions have complete text
- ✅ 100% of questions have solutions
- ✅ 100% of media references validated (all files present)
- ✅ 100% of bijlage references validated
- ⚠️ ~90% of questions have domain links
- ⚠️ ~30% of questions have subdomain links

**Validation**:

- All question JSONs validated for structure
- All media paths verified to exist
- All Azure URLs included as fallback
- No broken references

**Format**:

- Question text: HTML with MathML for mathematics
- Solutions: Plain text with Dutch CITO formatting
- Media: PNG, JPEG for images; PDF for bijlages
- Curriculum: Complete hierarchical structure

---

## 🔧 Programmatic Usage

### Loading Questions (Python)

```python
import json
from pathlib import Path

# Load all questions from an exam
exam_dir = Path("questions/vwo_biologie_2024_t1")

# Read exam metadata
with open(exam_dir / "metadata.json") as f:
    exam_meta = json.load(f)

# Load all questions
questions = []
for q_file in sorted(exam_dir.glob("q*.json")):
    with open(q_file) as f:
        questions.append(json.load(f))

# Access question data
for q in questions:
    print(f"{q['id']}: {q['question']['text'][:100]}...")
    print(f"  Max score: {q['question']['max_score']}")
    print(f"  Domains: {[d['name'] for d in q['metadata']['curriculum']['domains']]}")
```

### Resolving Media Paths

```python
# Media path is relative to archive root
media_path = q["content_context"][0]["media_path"]
full_path = Path("brainbooster-exam-data") / media_path
# => brainbooster-exam-data/media/in-exam/img_a3f5b2c1.png

# Azure URL as fallback
azure_url = q["content_context"][0]["azure_url"]
```

### Loading Curriculum

```python
# Load education level discipline lookup
with open("curriculum/education_level_disciplines.json") as f:
    ed_lookup = json.load(f)

# Find discipline details
ed_id = q["metadata"]["curriculum"]["education_level_discipline_id"]
ed_info = next(ed for ed in ed_lookup if ed["id"] == ed_id)

# Load full curriculum for this discipline
curriculum_file = f"curriculum/disciplines/{ed_info['education_level']}_{ed_info['discipline']}.json"
with open(curriculum_file) as f:
    curriculum = json.load(f)
```
