#pragma GCC diagnostic ignored "-Wwrite-strings"
#include <cstdint>
#include <cstring>
#include <cmath>
#include <future>
#include <iostream>
#include <iterator>
#include <limits>
#include <string>
#include <sstream>
#include <algorithm>
#include <fcntl.h>
#include <signal.h>
#include <spawn.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>
#include <python2.7/Python.h>
#include <vector>

#include <algorithm>
#include <cstdint>
#include <cstring>
#include <future>
#include <iostream>
#include <iterator>
#include <limits>
#include <string>
#include <sstream>

#include <fcntl.h>
#include <signal.h>
#include <spawn.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define ORWL_NANO (+1.0E-9)
#define ORWL_GIGA UINT64_C(1000000000)
#define  STDIN  0
#define  STDOUT 1
#define  STDERR 2

extern char** environ;



posix_spawn_file_actions_t setupIoRedirection(const std::string&, const std::string&);
int createProcess(pid_t&, const std::string&, posix_spawn_file_actions_t&);
int runProcess(pid_t&, int, int, int&, int&);
char** getCommandArgs(const std::string& commandLine);
int killProcess(pid_t& pid);
int getMaxMemoryUsage(pid_t, int);
int getCurrentMemoryUsage(pid_t);
long long getMillisecondsNow();
int killProcess(pid_t& pid);
const char* excute(std::string inputFilepath, std::string outputFilepath, std::string command, int timeLimit, int memoryLimit);

//time_get function (for mac)

static PyObject* wrap_excute(PyObject* self, PyObject* args){
    char* inputFilepath, *outputFilepath, *command;
    int timeLimit, memoryLimit;
    const char* res;
    PyObject* ret;
    if( !PyArg_ParseTuple(args, "sssii", &inputFilepath, &outputFilepath, &command, &timeLimit, &memoryLimit)){
        return NULL;
    }
    // std::cout << timeLimit << memoryLimit << std::endl;
    res = excute(std::string(inputFilepath), std::string(outputFilepath), std::string(command), timeLimit, memoryLimit);
    ret = Py_BuildValue("s", res);
    return ret;

}

static PyMethodDef RunnerMethods[] = {
    {"excute", wrap_excute, METH_VARARGS, "run process"},
    {NULL, NULL, 0, NULL}
};

PyMODINIT_FUNC initRunner(void){
    PyObject *m;
    m = Py_InitModule("Runner", RunnerMethods);
    if(m == NULL) {
        return;
    }
}

// int main(){
//     const char* res = excute("./hello.py", "io.txt", "python", 1000, 100);
//     std::cout << res << std::endl;
//     return 0;
// }

const char* excute(std::string inputFilepath, std::string outputFilepath, std::string command, int timeLimit, int memoryLimit){
    // IO redirection
    posix_spawn_file_actions_t fileActions = setupIoRedirection(inputFilepath, outputFilepath);
    pid_t pid = -1;
    int usedTime = 0;
    int usedMemory = 0;
    int exitCode;
    int proStatus = createProcess(pid, command, fileActions);
    if( proStatus != 0 ){
        return "Process Creation Failed";
    }
    exitCode = runProcess(pid, timeLimit, memoryLimit, usedTime, usedMemory);
    char buff[256];
    if (exitCode == 0){
        snprintf(buff, sizeof(buff), "Success,%d,%d,%d", exitCode,usedTime, usedMemory);
    }else{
        snprintf(buff, sizeof(buff), "Error,%d,%d,%d", exitCode,usedTime, usedMemory);
    }
    
    std::string buffAsStdStr = buff;
    return buffAsStdStr.c_str();
}


posix_spawn_file_actions_t setupIoRedirection(const std::string& inputFilepath, const std::string& outputFilepath){
    posix_spawn_file_actions_t fileActions;
    posix_spawn_file_actions_init(&fileActions);

    if(inputFilepath != ""){
        int inputFileDescriptor = open(inputFilepath.c_str(), O_RDONLY);
        posix_spawn_file_actions_adddup2(&fileActions, inputFileDescriptor, STDIN);
        posix_spawn_file_actions_addclose(&fileActions, inputFileDescriptor);
    }
    if(outputFilepath != ""){
        int outputFileDescriptor = open(outputFilepath.c_str(), O_CREAT | O_WRONLY);
        chmod(outputFilepath.c_str(), S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);
        posix_spawn_file_actions_adddup2(&fileActions, outputFileDescriptor, STDOUT);
        posix_spawn_file_actions_adddup2(&fileActions, outputFileDescriptor, STDERR);
        posix_spawn_file_actions_addclose(&fileActions, outputFileDescriptor);
    }
    return fileActions;
}

int createProcess(pid_t& pid, const std::string& commandLine, posix_spawn_file_actions_t& fileActions) {
    char** argv = getCommandArgs(commandLine);
    return posix_spawnp(&pid, argv[0], &fileActions, NULL, argv, environ);
}

int runProcess(pid_t& pid, int timeLimit, int memoryLimit, int& usedTime, int& usedMemory) {
    std::future<int>  feature    = std::async(std::launch::async, getMaxMemoryUsage, pid, memoryLimit);
    long long         startTime  = getMillisecondsNow();
    long long         endTime    = 0;
    int               exitCode   = 127;
                      usedMemory = feature.get();

    do {
        endTime     = getMillisecondsNow();
        usedTime    = endTime - startTime;
        
        if ( usedTime > timeLimit ) {
            killProcess(pid);
        }
        usleep(50000);
    } while ( waitpid(pid, &exitCode, WNOHANG) <= 0 );

    return exitCode;
}

char** getCommandArgs(const std::string& commandLine) {
    std::istringstream iss(commandLine);
    std::vector<std::string> args = {
        std::istream_iterator<std::string>{iss},
        std::istream_iterator<std::string>{}
    };

    size_t numberOfArguments = args.size();
    char** argv = new char*[numberOfArguments + 1]();

    for ( size_t i = 0; i < numberOfArguments; ++ i ) {
        char* arg = new char[ args[i].size() + 1 ];
        strcpy(arg, args[i].c_str());
        argv[i] = arg;
    }
    argv[numberOfArguments] = nullptr;

    return argv;
}

int getMaxMemoryUsage(pid_t pid, int memoryLimit) {
    int  maxMemoryUsage     = 0,
         currentMemoryUsage = 0;
    do {
        currentMemoryUsage = getCurrentMemoryUsage(pid);
        

        if ( currentMemoryUsage > maxMemoryUsage ) {
            maxMemoryUsage = currentMemoryUsage;
        }
        if ( memoryLimit != 0 && maxMemoryUsage > memoryLimit ) {
            killProcess(pid);
        }
        usleep(5000);
    } while ( currentMemoryUsage != 0 );

    return maxMemoryUsage;
}

int getCurrentMemoryUsage(pid_t pid) {
    int    currentMemoryUsage   = 0;
    long   residentSetSize      = 0L;
    FILE*  fp                   = NULL;
    
    std::stringstream stringStream;
    stringStream << "/proc/" << pid << "/statm";
    const char* filePath = stringStream.str().c_str();

    if ( (fp = fopen( filePath, "r" )) != NULL ) {
        if ( fscanf(fp, "%*s%ld", &residentSetSize) == 1 ) {
            currentMemoryUsage = (int)residentSetSize * (int)sysconf(_SC_PAGESIZE) >> 10;
            if ( currentMemoryUsage < 0 ) {
                currentMemoryUsage = std::numeric_limits<int32_t>::max() >> 10;
            }
        }
        fclose(fp);
    }
    return currentMemoryUsage;
}

long long getMillisecondsNow() {
    long            milliseconds;
    time_t          seconds;
    struct timespec spec;
    clock_gettime(CLOCK_REALTIME, &spec);
    seconds                 = spec.tv_sec;
    milliseconds            = std::round(spec.tv_nsec / 1.0e6);
    long long currentTime   = seconds * 1000 + milliseconds;

    return currentTime;
}

int killProcess(pid_t& pid) {
    return kill(pid, SIGKILL);
}
