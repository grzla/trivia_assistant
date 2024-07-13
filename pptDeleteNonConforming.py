from pptx import Presentation
import os
import re

# Define the root directory path containing the PowerPoint files
root_directory_path = './training'

# Initialize a list to keep track of deleted files
deleted_files = []

# Define the regular expression pattern for file naming
pattern = r'^\d{6}(F)?\.pptx$'

# Walk through all directories and subdirectories
for dirpath, dirnames, filenames in os.walk(root_directory_path):
	# Iterate over each file in the current directory
	for filename in filenames:
		# Construct the full file path
		file_path = os.path.join(dirpath, filename)
		# Check if the file is a PowerPoint file
		if filename.endswith('.pptx'):
			# Check if the file conforms to the naming convention
			if re.match(pattern, filename):
				try:
					prs = Presentation(file_path)
					# Count the number of slides
					num_slides = len(prs.slides)
					# Check if the number of slides is not equal to six
					if num_slides != 6:
						raise ValueError(f'{file_path} does not have exactly six slides, it has {num_slides} slides.')
				except Exception as e:
					print(f'{file_path} - {str(e)} Deleted.')
					# Delete the file
					os.remove(file_path)
					# Add the file path to the list of deleted files
					deleted_files.append(file_path)
			else:  # File does not conform to naming convention
				print(f'{file_path} does not conform to the naming convention. Deleted.')
				# Delete the file
				os.remove(file_path)
				# Add the file path to the list of deleted files
				deleted_files.append(file_path)

# Optionally, print the list of deleted files
for file in deleted_files:
	print(f'Deleted: {file}')