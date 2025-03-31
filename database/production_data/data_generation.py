import csv
import random

# Settings:
num_records = 3000
max_match_id = 40    # assuming you have around 40 games
max_player_id = 528  # from your players list

# Define ranges for fake statistics:
goal_range = (0, 3)         # 0 to 3 goals
pass_acc_range = (60.0, 100.0)  # pass accuracy between 60 and 100
assist_range = (0, 2)       # 0 to 2 assists
playtime = 90               # fixed playtime

# Open a CSV file to write data under the desired directory:
with open("database/production_data/fake_match_stats.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    # Write header row:
    writer.writerow(["match_id", "player_id", "goal", "pass_acc", "assist", "playtime"])
    
    for _ in range(num_records):
        match_id = random.randint(1, max_match_id)
        player_id = random.randint(1, max_player_id)
        goal = random.randint(goal_range[0], goal_range[1])
        pass_acc = round(random.uniform(*pass_acc_range), 2)
        assist = random.randint(assist_range[0], assist_range[1])
        writer.writerow([match_id, player_id, goal, pass_acc, assist, playtime])

print("Generated fake_match_stats.csv with", num_records, "records under database/production_data/ directory.")
