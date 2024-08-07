import json
import logging
from http.client import HTTPSConnection
'''Switches on logging of the requests module.'''
HTTPSConnection.debuglevel = 1
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
requests_log = logging.getLogger("requests.packages.urllib3")
requests_log.setLevel(logging.DEBUG)
requests_log.propagate = True
import requests
url = 'https://ai-companion-public.oss-cn-beijing.aliyuncs.com/user-upload/59a0d730428c4817b496fbd49819ec82-yi.txt?OSSAccessKeyId=LTAI5tNFDkVkVGsh5fvALUwd&Expires=1701431188&Signature=%2BVassIjzKzqnjZYSqza%2B1PSdaB4%3D'
requests.put(url, data='1') 