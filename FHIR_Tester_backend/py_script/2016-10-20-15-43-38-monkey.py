from selenium import webdriver
from selenium.webdriver.common.keys import Keys
driver = webdriver.PhantomJS()
driver.get('http://www.google.com')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/1.png')
ele = driver.find_element_by_css_selector("html body#gsr.hp.vasq div#viewport.ctr-p div#searchform.jhp.big form#tsf.tsf div.tsf-p div.sfibbbc div#sbtc.sbtc div.sbibtd div#sfdiv.sbibod div.gstl_0.sbib_a div#sb_ifc0.sbib_b div#gs_lc0 input#lst-ib.gsfi")
ele.send_keys('fhir')
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/2.png')
ele = driver.find_element_by_css_selector("html body#gsr.hp.vasqdiv#viewport.ctr-p div#searchform.jhp.big form#tsf.tsf div.tsf-p div.jsb center input")
ele.click()
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/3.png')
ele = driver.find_element_by_xpath("/html/body/div/div[3]/div/section/h2")
assert 'Search' in ele.text
driver.get_screenshot_as_file('/Users/Bowen/fhir/FHIR_Tester/FHIR_Tester_backend/services/../downloads/2016/10/20/img/4.png')
driver.close()