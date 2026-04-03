"""
Synthetic Dataset Generator — v3
Root cause of 100% accuracy: each class had EXCLUSIVE vocabulary.
Fix: same complaint TOPICS appear across all 4 classes — severity is
determined by DEGREE (how bad), not TOPIC (what kind of issue).
This forces the model to learn intensity signals, not keyword lookup.
Target: 82-90% accuracy with realistic confusion between adjacent classes.
"""

import random
import numpy as np
import pandas as pd
from pathlib import Path

random.seed(42)
np.random.seed(42)

LOCATIONS = [
    "Hazratganj", "Gomti Nagar", "Alambagh", "Chowk", "Aminabad",
    "Aliganj", "Indira Nagar", "Rajajipuram", "Mahanagar", "Vibhuti Khand",
    "Sultanpur Road", "Faizabad Road", "Kanpur Road", "Civil Lines",
    "Nishatganj", "Thakurganj", "Chinhat", "Telibagh", "Jankipuram",
    "near the main market", "behind the bus stand", "Sector 14",
]
TIME_REFS = ["for 2 days", "since yesterday", "for a week", "since morning", "since last night"]

# ─── Same TOPIC, 4 severity levels ───────────────────────────────────────────
# Each topic has low/medium/high/critical variants so vocabulary overlaps heavily.
# The model must learn DEGREE signals (dangerous, accidents, trapped, etc.)

TOPIC_TEMPLATES = {

    "road_damage": {
        "low":      [
            "There is a small crack on the road near {location}. Not affecting traffic yet.",
            "Sadak par ek chota sa gaddha hai {location} ke paas. Abhi koi accident nahi hua.",
            "Minor road damage near {location}. Vehicles passing without issue.",
        ],
        "medium":   [
            "A pothole has developed near {location}. Vehicles are slowing down and swerving.",
            "{location} ke paas sadak mein gaddha ho gaya. Gaadiyaan slow ho rahi hain.",
            "Road damage near {location} is getting worse. Two-wheelers at risk at night.",
        ],
        "high":     [
            "Large dangerous pothole near {location} has caused 2 accidents this week.",
            "{location} ke paas bada gaddha hai. Is hafte 2 accident ho chuke hain.",
            "Road has partially collapsed near {location}. Heavy vehicles cannot pass.",
        ],
        "critical": [
            "Road completely collapsed near {location}. Sinkhole formed. Area cordoned off.",
            "{location} ke paas sadak poori tarah dhaas gayi. Bada sinkhole ban gaya.",
            "Major road collapse near {location}. Multiple vehicles stuck. Emergency.",
        ],
    },

    "waterlogging": {
        "low":      [
            "Minor waterlogging near {location} after rain. Clears within an hour.",
            "{location} ke paas thoda paani bhara baarish ke baad. Jald saaf ho jaata hai.",
            "Small puddle near {location}. No major inconvenience.",
        ],
        "medium":   [
            "Waterlogging near {location} {time_ref}. Road is difficult to cross on foot.",
            "{location} mein {time_ref} se paani bhara hua hai. Logon ko dikkat ho rahi hai.",
            "Drainage blocked near {location}. Water standing on road after every rain.",
        ],
        "high":     [
            "Severe waterlogging near {location}. Water entering ground floor shops and homes.",
            "{location} mein paani ghar mein ghus raha hai. Kafi families affected hain.",
            "Floodwater near {location} blocking main road {time_ref}. Vehicles stranded.",
        ],
        "critical": [
            "Flash flood near {location}. Entire street submerged. People stranded on rooftops.",
            "{location} mein badi baadhh aayi. Log chhat par hain. Rescue ki zaroorat hai.",
            "Flood water 4 feet high near {location}. Elderly and children trapped. Help needed now.",
        ],
    },

    "electricity": {
        "low":      [
            "Street light near {location} is flickering. Still partially working.",
            "{location} ke paas ek light thodi weak ho gayi hai. Kaam chal raha hai.",
            "One streetlight out near {location}. Area still lit by other lights.",
        ],
        "medium":   [
            "Street lights on {location} road have been off {time_ref}. Night travel unsafe.",
            "{location} mein {time_ref} se bijli nahi hai raat ko. Log pareshan hain.",
            "Power outage near {location} {time_ref}. Residents and shops affected.",
        ],
        "high":     [
            "Electricity pole tilting dangerously near {location}. Could fall any time.",
            "{location} ke paas bijli ka khamba jhuk gaya hai. Bahut khatarnak hai.",
            "Exposed live wires hanging near {location} footpath after storm. Very dangerous.",
        ],
        "critical": [
            "High voltage pole fallen on road near {location}. Multiple people injured.",
            "{location} mein bijli ka pole gir gaya. Kai log zakhmi. Ambulance bhejo.",
            "Live wire on ground near {location}. One person already got shock. Emergency.",
        ],
    },

    "sewage": {
        "low":      [
            "Dustbin near {location} slightly overflowing. Needs cleaning.",
            "{location} ke paas kachra thoda zyada ho gaya. Saaf karna chahiye.",
            "Mild smell from drain near {location}. Not a major issue yet.",
        ],
        "medium":   [
            "Drain clogged near {location}. Sewage smell affecting nearby residents.",
            "Garbage not collected from {location} {time_ref}. Smell and flies increasing.",
            "{location} ke paas nali jam gayi. Badboo aa rahi hai. Log pareshan hain.",
        ],
        "high":     [
            "Sewage overflowing into residential area near {location}. Health risk.",
            "{location} mein sewage overflow ho raha hai. Ghar mein ghus raha hai.",
            "Raw sewage on road near {location} {time_ref}. Children falling sick.",
        ],
        "critical": [
            "Sewage pipeline burst near {location}. Entire area flooded with waste water.",
            "{location} ke paas sewage pipe phut gayi. Poora area contaminated.",
            "Major sewage overflow near {location}. Cholera risk. Immediate action needed.",
        ],
    },

    "structure": {
        "low":      [
            "Small crack visible on boundary wall near {location}. No immediate danger.",
            "{location} ke paas diwar mein thodi si darar aa gayi. Koi khatre ki baat nahi.",
            "Paint peeling from bridge wall near {location}. Structural check needed.",
        ],
        "medium":   [
            "Cracks developing on road overpass near {location}. Needs inspection.",
            "Boundary wall near {location} leaning slightly. Could be unsafe in rain.",
            "{location} ke paas building ki diwar mein dararein badh rahi hain.",
        ],
        "high":     [
            "Large section of wall collapsed near {location}. Road partially blocked.",
            "{location} ke paas diwar gir gayi. Rasta block ho gaya hai.",
            "Bridge near {location} has developed serious cracks. Load limit exceeded.",
        ],
        "critical": [
            "Building collapsed near {location}. People trapped under debris. URGENT.",
            "{location} ke paas imarat gir gayi. Log malaabe mein phanse hain. MADAD CHAHIYE.",
            "School roof collapsed near {location}. Students were inside. Rescue needed.",
        ],
    },

    "water_supply": {
        "low":      [
            "Water pressure slightly low near {location}. Not a big issue.",
            "{location} mein paani ka pressure thoda kam hai. Chal raha hai abhi.",
            "Minor pipe leak near {location}. Small puddle forming.",
        ],
        "medium":   [
            "Water supply disrupted near {location} {time_ref}. Residents managing with stored water.",
            "Pipe leaking near {location} {time_ref}. Water wasted and road wet.",
            "{location} mein paani {time_ref} se nahi aa raha. Log tank se kaam chala rahe hain.",
        ],
        "high":     [
            "Main water pipe burst near {location}. Road flooded. Supply cut to 200 homes.",
            "{location} ke paas paani ki pipe phut gayi. Sadak par paani bhar gaya.",
            "Water contamination reported near {location}. People falling ill after drinking.",
        ],
        "critical": [
            "Water supply to entire sector cut near {location} {time_ref}. Hospital affected.",
            "Contaminated water causing mass illness near {location}. 20+ hospitalised.",
            "{location} ke paas paani mein zeher milne ki khabar. Log beemar pad rahe hain.",
        ],
    },
}

LABEL_MAP = {"low": 0, "medium": 1, "high": 2, "critical": 3}

NOISE_SUFFIXES = [
    "This has been reported before with no action.",
    "Please look into this.",
    "Kindly take action.",
    "No response to previous complaints.",
    "Residents are very concerned.",
    "Daily inconvenience for everyone.",
    "Pehle bhi complaint ki thi, koi action nahi.",
    "Jaldi kuch karo please.",
]

TYPO_MAP = {
    "pothole": ["pothle", "pot hole"],
    "blocked": ["blokced"],
    "accident": ["accedent"],
    "collapsed": ["colapsed"],
    "garbage": ["garbge"],
    "leaking": ["leakng"],
    "dangerous": ["dangrous"],
}

def inject_typo(text):
    for word, typos in TYPO_MAP.items():
        if word in text.lower() and random.random() < 0.3:
            return text.replace(word, random.choice(typos), 1)
    return text

def apply_noise(text, label):
    # 15% ALL CAPS for urgent reports
    if label in ("high", "critical") and random.random() < 0.15:
        return text.upper()
    # 12% truncation
    if random.random() < 0.12:
        words = text.split()
        text = " ".join(words[:max(6, int(len(words) * 0.7))])
    # 20% typo injection
    if random.random() < 0.20:
        text = inject_typo(text)
    # 10% strip punctuation
    if random.random() < 0.10 and text.endswith("."):
        text = text[:-1]
    return text


def generate_text_samples(n_per_class=300):
    records = []
    topics = list(TOPIC_TEMPLATES.keys())

    for label in ["low", "medium", "high", "critical"]:
        for _ in range(n_per_class):
            # Pick random topic — SAME topics appear in all 4 classes
            topic = random.choice(topics)
            template = random.choice(TOPIC_TEMPLATES[topic][label])
            text = template.format(
                location=random.choice(LOCATIONS),
                time_ref=random.choice(TIME_REFS)
            )
            # 25% chance append noise suffix
            if random.random() < 0.25:
                text += " " + random.choice(NOISE_SUFFIXES)
            # 8% duplicate-style prefix
            if random.random() < 0.08:
                text = "Again reporting: " + text
            # Apply noise
            text = apply_noise(text, label)
            records.append({"text": text, "label": label, "label_id": LABEL_MAP[label]})

    df = pd.DataFrame(records).sample(frac=1, random_state=42).reset_index(drop=True)
    return df


def generate_image_features(label, n=1):
    """
    Overlapping Gaussian profiles — adjacent classes share similar ranges.
    This prevents image features from being trivially separable.
    """
    profiles = {
        "low":      [0.65, 0.35, 0.20, 0.06, 0.55, 0.70, 1.8, 0.10],
        "medium":   [0.53, 0.47, 0.37, 0.22, 0.47, 0.57, 3.1, 0.37],
        "high":     [0.41, 0.59, 0.57, 0.46, 0.40, 0.45, 4.3, 0.63],
        "critical": [0.28, 0.70, 0.77, 0.73, 0.34, 0.32, 5.6, 0.88],
    }
    # Use a single std for all features — wide enough to cause overlap
    std = 0.14
    means = profiles[label]
    noise = np.random.normal(0, std, (n, 8))
    features = np.clip(np.array(means) + noise, 0, 1)
    features[:, 6] = np.clip(features[:, 6] * 8, 1, 8)  # object count scale
    return features


def generate_full_dataset(n_per_class=300):
    text_df = generate_text_samples(n_per_class)
    img_features = np.array([
        generate_image_features(label, n=1)[0]
        for label in text_df["label"]
    ])
    return text_df, img_features


if __name__ == "__main__":
    Path("data").mkdir(exist_ok=True)
    print("Generating v3 dataset (topic-overlap, degree-based labels)...")
    df, img_feats = generate_full_dataset(n_per_class=300)
    df.to_csv("data/grievances.csv", index=False)
    np.save("data/image_features.npy", img_feats)
    print(f"\nSaved {len(df)} samples")
    print(df["label"].value_counts())
    print("\nSample per class (same TOPIC, different severity):")
    for label in ["low", "medium", "high", "critical"]:
        sample = df[df["label"] == label]["text"].iloc[0]
        print(f"  [{label.upper():8s}] {sample[:90]}")
