from selenium import webdriver
from selenium.webdriver.common.keys import Keys
driver = webdriver.PhantomJS()
driver.set_window_size(1440,960)
driver.get('http://www.python.org')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/1.png')
ele = driver.find_element_by_css_selector("input#id-search-field.search-field.placeholder")
ele.send_keys('pycon')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/2.png')
ele = driver.find_element_by_xpath('/html/body/div/header/div/div[1]/form/fieldset/button')
ele.click()
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/3.png')
ele = driver.find_element_by_xpath("/html/body/div/div[3]/div/section/h2")
assert 'Search' in ele.text
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4.png')
driver.close()