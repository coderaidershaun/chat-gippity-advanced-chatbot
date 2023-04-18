from func_utils import create_temp_file, get_media_type
from func_ai import call_openai, clean_user_message, identify_file_ext


# Text file task handling
def contruct_system_content(route_id, messages):

  # Initialize content type
  # f = file
  content_type = ""

  # Show Route ID
  print("Route ID:", route_id)

  # Clean messages to avoid LLM issues
  cleaned_message = clean_user_message(messages)

  # Adjust last user message and remove chatbot response to avoid LLM issues
  messages[-2]["content"] = cleaned_message
  messages = messages[:-1]
  message_text = call_openai(messages, "gpt-4")

  # Handle If File
  file_ext = ""
  if route_id in [1, 2, 4]:
    content_type = "f"
    file_ext = identify_file_ext(message_text)
    if file_ext[0] != "." or len(file_ext) > 10:
      file_ext = ".txt"

  # Get file url
  system_content = create_temp_file(message_text, file_ext)

  # Return response
  return system_content, content_type, file_ext
