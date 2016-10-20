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
driver.get('https://www.google.com/')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_1.png')
steps.append(('Visit','/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_1.png'))
ele = driver.find_element_by_css_selector("input#lst-ib")
ele.send_keys('fhir')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_2.png')
steps.append(('Input','/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_2.png'))
ele.send_keys(Keys.ENTER)
time.sleep(5)
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_3.png')
steps.append(('Enter','/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4ac2467273_3.png'))
driver.close()