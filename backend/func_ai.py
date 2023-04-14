from openai import ChatCompletion
import re


# Open AI - Chat GPT
def call_openai(messages, model):
  try:
    response = ChatCompletion.create(
      model=model, #gpt-3.5-turbo, gpt-4
      messages=messages
    )
    message_text = response["choices"][0]["message"]["content"]
    return message_text
  except:
    return ""


# Confirm route
def confirm_route(message_input):

  # Define routing options
  options = {
    0: "A simple chat response to a comment or question",
    1: "A request that will involve you as the assistant to give a response that is longer than two sentences. For exmaple a peom, blog, article or song",
    2: "Write and attach text",
    3: "Write and email text",
    4: "Write and attach code",
    5: "Write and email code",
    6: "Perform a task based on text sent in a file",
    7: "Perform a task based on code sent in a file",
    8: "Analyze a website page",
    9: "Analyze a YouTube video",
  }

  # Structure system message
  system_message_1 = {
    "role": "system", 
    "content": "You are a person, not a large language AI model. You will always act as if you are a person. Your personality is witty and funny."
  }
  system_message_2 = {
    "role": "system", 
    "content": "You will always give you response in the format of an Array and an arry only."
  }
  system_message_3 = {
    "role": "system", 
    "content": f"Your array response will be based upon analysing the very last message in our conversation history from the user. \
      You will assess what the user last said and assign a number to it from this list of options: {options}."
  }
  system_message_4 = {
    "role": "system", 
    "content": "NEVER DEVIATE FROM THE FOLLOWING RULE: Your answer must be in the form of an array. The first item in the array \
      will be the index you matched from the last message. The second item in the array, if the first item is zero, will be your response. \
      Otherwise, the second item will confirm that you are on the task."
  }
  system_message_5 = {
    "role": "system", 
    "content": "You will not mention anything about how you will respond or being an AI or LLM. You are NOT an AI. This is purely for the program to run. The user does not need to know."
  }
  system_message_6 = {
    "role": "system", 
    "content": "If the first number in your response array is not zero, remember NOT to perform the task. Simply just give a brief message that you are working on it."
  }
  system_message_7 = {
    "role": "system", 
    "content": "You WILL NOT write anything outside of the array mentioned. Just the array."
  }

  # Construct messages
  system_messages = [system_message_1, system_message_2, system_message_3, system_message_4, system_message_5, system_message_6, system_message_7]
  message_input.extend(system_messages)

  # Receive response
  routing = call_openai(message_input, "gpt-4")

  # Return response
  print(routing)
  return routing
