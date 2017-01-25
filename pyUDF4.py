import unicodedata
import re

@outputSchema("text:chararray")
def strip_accents(input):
    if input is None:
        return ""
    else:
        input = input.lower()
        
        #remove diacritics
        input = unicode(input, 'utf-8')
        input = unicodedata.normalize('NFD', input).encode('ASCII', 'ignore')
		
		input = input.replace("."," ").replace("\t"," ").replace('"', " ").replace("<", " ").replace(">"," ").replace(";"," ")
        
        input = re.sub('[^a-z0-9 ]','',input)
        input = re.sub('[ ]{2,}',' ',input)
        input = input.strip()
        
        return input
