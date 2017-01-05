'use strict';

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
        var object = _x,
            property = _x2,
            receiver = _x3;
        desc = parent = getter = undefined;
        _again = false;
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);
            if (parent === null) {
                return undefined;
            } else {
                _x = parent;
                _x2 = property;
                _x3 = receiver;
                _again = true;
                continue _function;
            }
        } else if ('value' in desc) {
            return desc.value;
        } else {
            var getter = desc.get;
            if (getter === undefined) {
                return undefined;
            }
            return getter.call(receiver);
        }
    }
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) subClass.__proto__ = superClass;
}

var _React = React;
var addons = _React.addons;
var Children = _React.Children;
var cloneElement = _React.cloneElement;
var Component = _React.Component;
var findDOMNode = _React.findDOMNode;
var render = _React.render;
var PropTypes = _React.PropTypes;
var classSet = addons.classSet;

var keys = {
    down: 'ArrowDown',
    enter: 'Enter',
    up: 'ArrowUp'
};

var serverlist = [];

$.ajax({
    url: "servers.json",
    type: "GET",
    async:false,
    success: function(data){
        var json_obj = eval("("+data+")");

        for (var i = 0; i < json_obj.servers.length; i++) {
            serverlist.push(json_obj.servers[i].name);
        }
    }
});



var DatalistFallback = (function(_Component) {
    function DatalistFallback(props) {
        _classCallCheck(this, DatalistFallback);

        _get(Object.getPrototypeOf(DatalistFallback.prototype), 'constructor', this).call(this, props);

        this.state = {
            inputWidth: null, 
            selectedSuggestion: 0, 
            showSuggestions: false, 
            shownOptions: []
        };
    }

    _inherits(DatalistFallback, _Component);

    return DatalistFallback;
})(Component);

var AutoComplete = (function(_Component2) {
    function AutoComplete(props) {
        _classCallCheck(this, AutoComplete);

        _get(Object.getPrototypeOf(AutoComplete.prototype), 'constructor', this).call(this, props);

        this.state = {
            inputWidth: null, 
            selectedSuggestion: 0, 
            showSuggestions: false, 
            shownOptions: [], 
            nativeSupport: this._supportsNative(),
            // options: ['Chrome', 'Firefox', 'Internet Explorer', 'Opera', 'Safari'],
            options: serverlist,
            value: ''
        };
    }

    _inherits(AutoComplete, _Component2);

    _createClass(AutoComplete, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var inputWidth = findDOMNode(this.refs.input).offsetWidth + 'px';

            this.setState({
                inputWidth: inputWidth
            });
        }
    }, {
        key: '_supportsNative',
        value: function _supportsNative() {
            var feature = document.createElement('datalist');

            return Boolean(feature && feature.options);
        }
    }, {
        key: '_isOptionShown',
        value: function _isOptionShown(option) {
            var optionRegex = new RegExp(this.state.value, 'gi');
            var optionMatchesInput = this.state.value && option.match(optionRegex);

            return this.state.showSuggestions && optionMatchesInput;
        }
    }, {
        key: '_renderFallbackOptions',
        value: function _renderFallbackOptions() {
            var _this = this;

            var options = this.state.shownOptions.map(function(option, index) {
                var isSelected = index === _this.state.selectedSuggestion;
                var classNames = classSet({
                    'lookahead__option': true,
                    'lookahead__option--selected': isSelected
                });
                var onClick = _this.onFallbackOptionClick.bind(_this, option);

                return React.createElement(
                    'li', {
                        className: classNames,
                        'aria-selected': isSelected,
                        key: index,
                        onMouseDown: onClick,
                        role: 'option'
                    },
                    option
                );
            });

            var classNames = classSet({
                'lookahead__fallback-options': true,
                'lookahead__fallback-options--shown': this.state.showSuggestions && this.state.value
            });

            return React.createElement(
                'ul', {
                    'aria-multiselectable': 'false',
                    className: classNames,
                    role: 'listbox',
                    style: {
                        width: this.state.inputWidth
                    }
                },
                options
            );
        }
    }, {
        key: '_renderOptions',
        value: function _renderOptions() {
            if (!this.state.nativeSupport) {
                return this._renderFallbackOptions();
            }

            var options = this.state.options.map(function(option, index) {
                return React.createElement('option', {
                    key: index,
                    value: option
                });
            });

            return React.createElement(
                'datalist', {
                    id: this.props.name
                },
                options
            );
        }
    }, {
        key: '_renderChildren',
        value: function _renderChildren() {
            var child = Children.only(this.props.children);
            var props = {
                list: this.props.name,
                onBlur: this.onBlur.bind(this),
                onChange: this.onChange.bind(this),
                ref: 'input',
                value: this.state.value
            };

            if (!this.state.nativeSupport) {
                props.onKeyDown = this.onKeyDown.bind(this);
            }

            return cloneElement(child, props);
        }
    }, {
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            var key = event.key;
            var _state = this.state;
            var selectedSuggestion = _state.selectedSuggestion;
            var shownOptions = _state.shownOptions;

            var nextIndex = undefined;

            switch (key) {
                case keys.down:
                    var maxIndex = shownOptions.length - 1;
                    nextIndex = selectedSuggestion === maxIndex ? maxIndex : selectedSuggestion + 1;
                    break;
                case keys.up:
                    nextIndex = selectedSuggestion <= 0 ? 0 : selectedSuggestion - 1;
                    break;
                default:
                    return;
            }

            this.setState({
                selectedSuggestion: nextIndex
            });
        }
    }, {
        key: 'onFallbackOptionClick',
        value: function onFallbackOptionClick(option) {
            this.setState({
                showSuggestions: false,
                value: option
            });
        }
    }, {
        key: 'onBlur',
        value: function onBlur() {
            this.setState({
                showSuggestions: false
            });
        }
    }, {
        key: 'onChange',
        value: function onChange(event) {
            var _this2 = this;

            var value = event.target.value;

            var newState = {
                value: value
            };

            if (!this.state.nativeSupport) {
                newState.showSuggestions = true;
                newState.shownOptions = this.state.options.filter(function(option) {
                    return _this2._isOptionShown(option);
                });
            }

            this.setState(newState);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'section', {
                    className: 'lookahead'
                },
                this._renderChildren(),
                this._renderOptions()
            );
        }
    }]);

    return AutoComplete;
})(Component);

AutoComplete.propTypes = {
    name: PropTypes.string.isRequired
};

var Wrapper = (function(_Component3) {
    function Wrapper() {
        _classCallCheck(this, Wrapper);

        if (_Component3 != null) {
            _Component3.apply(this, arguments);
        }
    }

    _inherits(Wrapper, _Component3);

    _createClass(Wrapper, [{
        key: 'render',
        value: function render() {
            return (
                // React.createElement(
                //     'label',
                //     null,
                //     'test auto server list:',
                    React.createElement("div", {className: "dropdown server-list"}, 
                        React.createElement(
                            AutoComplete, {
                                name: 'browsers'
                            },
                            React.createElement('input', {
                                placeholder: 'server name'
                            })
                        )
                    )
                // )
            ); 
            
        }
    }]);

    return Wrapper;
})(Component);

render(React.createElement(Wrapper, null), document.getElementById("main"));
