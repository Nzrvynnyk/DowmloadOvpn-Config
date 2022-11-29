from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import time
import selenium
import random
import string
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time 
from twocaptcha import TwoCaptcha
from solveRecaptcha import solveRecaptcha
#from Username import username


letters = string.ascii_lowercase
username = ( ''.join(random.choice(letters) for i in range(10)) )

options = webdriver.ChromeOptions()
options.add_argument("load-extension=/app/bgnkhhnnamicmpeenaelnjfhikgbkllg/4.1.46_0")
options.add_argument('--headless')
options.add_argument('--no-sandbox')
driver = webdriver.Chrome(options=options)
driver.get("https://www.vpnjantit.com/create-free-account?server=ua1&type=OpenVPN")
time.sleep(5)
elem0 = driver.find_element("xpath", '//button/p').click()
elem = driver.find_element("xpath", '//*[@id="create"]/div/div/div/div/div/div/form/div/input')
elem.send_keys(username)
time.sleep(5)
elem2 = driver.find_element("xpath",'//*[@id="create"]/div/div/div/div/div/div/form/div[2]/input')
elem2.send_keys(username)


result = solveRecaptcha(
    "6Le_mAsUAAAAAEiwIL8vzhmlnHft9NHNqREvwsnw",
    "https://www.vpnjantit.com/create-free-account?server=ua1&type=OpenVPN"
)
 
code = result['code']

print(code)

WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, 'g-recaptcha-response'))
)

driver.execute_script(
    "document.getElementById('g-recaptcha-response').innerHTML = " + "'" + code + "'")

driver.find_element(By.XPATH,'//*[@id="create"]/div/div/div/div/div/div/form/div[3]/input').click()

time.sleep(10)

driver.find_element(By.XPATH, '//*[@id="create"]/div/div/div[3]/div/div/div/a[3]').click()

time.sleep(15)
driver.close()