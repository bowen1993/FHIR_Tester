from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
user_agent = (
   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Safari/602.1.50'"
)
driver = webdriver.Chrome()
driver.implicitly_wait(5)
driver.get('https://gallery.smarthealthit.org/gemomics/genomicsadvisor')
ele = driver.find_element_by_xpath('/html/body/div[3]/div[1]/div/div/div[2]/div/div/a')
ele.click()
ele = driver.find_element_by_css_selector('input#j_username')
ele.send_keys('Bowen')
ele = driver.find_element_by_css_selector('input#j_password')
ele.send_keys('YLX-7sw-7ZT-PBK')
ele = driver.find_element_by_xpath('/html/body/div[1]/div[2]/div/div/form/div[3]/input')
ele.click()
ele = driver.find_element_by_css_selector('a#launch-button')
ele.click()
ele = driver.find_element_by_xpath('/html/body/div[1]/div[2]/div/div[2]/div[2]/div[1]/table/tbody/tr[1]')
ele.click()
ele = driver.find_element_by_xpath('/html/body/div[1]/div[2]/div/div[3]/div/div[2]/div')
ele.click()
time.sleep(5)
print driver.window_handles
window_after = driver.window_handles[-1]
driver.switch_to_window(window_after)
ele = driver.find_element_by_xpath('/html/body/div/ul/a[1]')
ele.click()
