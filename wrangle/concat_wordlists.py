import os
import pandas as pd

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the output_lists directory
output_lists_dir = os.path.join(current_dir, 'output_lists')

# List of CSV files to concatenate in the specified order
csv_files = [
    '2LW_formatted_list.csv',
    '2-3LW_formatted_list.csv',
    '3L_c_formatted_list.csv',
    '3L_j_formatted_list.csv',
    '3L_k_formatted_list.csv',
    '3L_q_formatted_list.csv',
    '3L_v_formatted_list.csv',
    '3L_z_formatted_list.csv',
    'TISANE_bingo_formatted_list.csv',
    'SATIRE_bingo_formatted_list.csv',
    'RETINA_bingo_formatted_list.csv',
]

# Initialize an empty list to store DataFrames
dataframes = []

# Read each CSV file and append to the list
for file in csv_files:
    file_path = os.path.join(output_lists_dir, file)
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        dataframes.append(df)
    else:
        print(f"Warning: {file} not found in the output_lists directory.")

# Concatenate all DataFrames
if dataframes:
    combined_df = pd.concat(dataframes, ignore_index=True)

    # Construct the path for the output file
    output_file = os.path.join(current_dir, 'tinware-wordlist.csv')

    # Save the combined DataFrame to CSV
    combined_df.to_csv(output_file, index=False)
    print(f"Combined CSV file saved as {output_file}")
else:
    print("No CSV files were found or read successfully.")