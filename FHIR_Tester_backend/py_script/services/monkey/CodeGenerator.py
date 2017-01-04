def Prefer(value="PhantomJS"):
    return True, "driver = webdriver.%s(desired_capabilities=dcap)\ndriver.implicitly_wait(10)\ndriver.set_window_size(1440,960)\n" % value

def Patient(value=0):
    return True, ""

def Visit(value=""):
    if len(value) > 0:
        return True, "driver.get('%s')\n" % value
    else:
        return False, "Wrong URL"

def DoGenomicAuth(screenshot_func,index):
    return True,1, '''ele = driver.find_element_by_css_selector('input#inputEmail')
ele.send_keys('test@email.com')
ele = driver.find_element_by_css_selector('input#inputPassword')
ele.send_keys('123456')
ele = driver.find_element_by_xpath('/html/body/div/form/button')
ele.click()
ele = driver.find_element_by_xpath('/html/body/div/div/div/form/button[1]')
%s
ele.click()
''' % screenshot_func("%d.png"%index, "Genomic Auth")

def LoadSmartApp(value=""):
    if len(value) > 0:
        return True, '''driver.get('%s')
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
''' % value
    else: return False, "Wrong URL"

def Blind(value=True):
    return True, ""

def judge_target(target):
    if '/' in target:
        return 'xpath'
    elif '#' in target or '.' in target: 
        return 'css'
    else:
        return 'element'

def get_find_stmt(target):
    find_stmt = ""
    find_type = judge_target(target)
    if find_type == 'xpath':
        find_stmt = "ele = driver.find_element_by_xpath(\"%s\")\n" % target
    elif find_type == 'css':
        find_stmt = "ele = driver.find_element_by_css_selector(\"%s\")\n" % target
    elif find_type == "element":
        find_stmt = "ele = driver.find_element_by_tag_name(\"%s\")\n" % target
    return find_stmt

def Click(target=""):
    if len(target) > 0:
        find_stmt = get_find_stmt(target)
        return True, "%sele.click()\n" % find_stmt
    else:
        return False, "No target"

def Input(target="", value=""):
    if len(target) > 0:
        find_stmt = get_find_stmt(target)
        return True, "%sele.send_keys('%s')\n" % (find_stmt, value)
    else:
        return False, "No target"

def Choose(target="", value=""):
    return True, ""

def Back():
    return True, "driver.back()\n"

def Enter():
    return True, "ele.send_keys(Keys.ENTER)\ntime.sleep(5)\n"

def Forward():
    return True, "driver.forward()\n"

def Switch(value=""):
    return True, "driver.switch_to.window('%s')\n" % value

def Judge(target="", value="", is_equal=True):
    if len(target) > 0:
        find_stmt = get_find_stmt(target)
        comp = "in" if is_equal else "not in"
        assert_str = "assert '%s' %s ele.text" % (value, comp)
        return True, "%s%s\n" % (find_stmt, assert_str)
    else:
        return False, "No target"