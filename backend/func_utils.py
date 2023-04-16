import tempfile


# Create a temporary file
def create_temp_file(content: str, fileType) -> str:
  with tempfile.NamedTemporaryFile(mode="w+", delete=False, suffix=fileType) as temp_file:
    temp_file.write(content)
    return temp_file.name


# Get media type for returning
def get_media_type(file_ext: str) -> str:
  media_type_map = {
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.py': 'text/x-python',
    '.go': 'text/plain',
    '.rs': 'text/plain',
    '.cpp': 'text/plain',
    '.c': 'text/plain',
    '.sol': 'text/plain',
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
    '.tsx': 'application/typescript',
    '.jsx': 'application/javascript',
  }
  return media_type_map.get(file_ext, 'application/octet-stream')
