from func_utils import create_temp_file, get_media_type
from func_ai import call_openai, clean_user_message


# Text file task handling
def contruct_system_content(route_id, messages):

  # Show Route ID
  print("Route ID:", route_id)

  # Clean messages to avoid LLM issues
  cleaned_message = clean_user_message(messages)

  # Adjust last user message and remove chatbot response to avoid LLM issues
  messages[-2]["content"] = cleaned_message
  messages = messages[:-1]
  message_text = call_openai(messages, "gpt-4")
  print(message_text)

  # Initialize
  temp_file = ""
  message_text = ""
  media_type = ""
  file_ext = ".txt"
  send_type = "f"

  # # Define system message
  # # Structure messages - Write and attach text
  # system_message = ""
  # if route_id == 1 or route_id == 2:
  #   system_message = {
  #     "role": "system", 
  #     "content": "Do NOT reply to the last message from the user. The user has asked for a file. \
  #       What the user is REALLY asking for, is for the text that would be in the file. \
  #       They are NOT asking for a file. So JUST write the text relating to their request only. \
  #       Do not write ANYTHING other that what the user is asking for. If the user asks you to send something, just WRITE it. \
  #       Do NOT say you cannot send it. The user already knows that. Just write what is being requested."
  #   }

  # # Extract OpenAI Response
  # message_input.append(system_message)
  # message_text = call_openai(message_input, "gpt-4")

  # # File setup
  # if len(message_text) > 0:
  #   temp_file = create_temp_file(message_text, file_ext)
  #   media_type = get_media_type(file_ext)

  # # Return response
  # return temp_file, send_type, media_type, file_ext
