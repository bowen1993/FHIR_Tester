from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
user_agent = (
   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Safari/602.1.50'"
)
steps = []
dcap = dict(DesiredCapabilities.PHANTOMJS)
dcap["phantomjs.page.settings.userAgent"] = user_agent
driver = webdriver.PhantomJS(desired_capabilities=dcap)
driver.get('http://genomics-advisor.smartplatforms.org:2048')
time.sleep(3)
driver.get_screenshot_as_file('~/Desktop/_1.png')
steps.append(('Visit','/_1.png'))
ele = driver.find_element_by_css_selector("input#inputEmail")
ele.send_keys('test@email.com')
driver.get_screenshot_as_file('~/Desktop/_2.png')
steps.append(('Input','/_2.png'))
ele = driver.find_element_by_css_selector("input#inputPassword")
ele.send_keys('123456')
driver.get_screenshot_as_file('~/Desktop/_3.png')
steps.append(('Input','/_3.png'))
ele.send_keys(Keys.ENTER)
time.sleep(5)
driver.get_screenshot_as_file('~/Desktop/_4.png')
steps.append(('Enter','/_4.png'))
driver.close()