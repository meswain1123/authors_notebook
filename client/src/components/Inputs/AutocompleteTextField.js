// import React, { createRef } from 'react';
// import PropTypes from 'prop-types';
// // import getCaretCoordinates from './textarea-caret';
// // import getCaretCoordinates from 'textarea-caret';
// import getInputSelection, { setCaretPosition } from 'get-input-selection';
import '../../assets/css/AutocompleteTextField.css';
// import {
//   Button
//   // FormControl,
//   // OutlinedInput,
//   // InputLabel,
//   // FormHelperText
// } from "@material-ui/core";
// import Quill, {
//   // QuillOptionsStatic,
//   // DeltaStatic,
//   RangeStatic,
//   // BoundsStatic,
//   // StringMap,
//   // Sources,
// } from 'quill';
// import ContentEditable from "react-contenteditable";
// import ContentEditable from "./ContentEditable";
import sanitizeHtml from "sanitize-html";
// import "../../assets/css/editable-content.css";


import React, { createRef } from 'react';
import PropTypes from 'prop-types';
// import ReactQuill from 'react-quill';
import ReactQuill from './ReactQuill';
  
const modules = {
  toolbar: [
    [
      // { 'header': [1, 2, false] }
    ],
    [
      'bold', 'italic', 'underline','strike', 'blockquote'
    ],
    [
      {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}
    ],
    [
      'link', 
      'image'
    ],
    [
      'clean'
    ]
  ],
};

const formats = [
  'header',
  'bold', 
  'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 
  'image'
];

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_RETURN = 13;
const KEY_ENTER = 14;
const KEY_ESCAPE = 27;
const KEY_TAB = 9;

const propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  maxOptions: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onRequestOptions: PropTypes.func,
  // options: PropTypes.arrayOf(PropTypes.Object),
  regex: PropTypes.string,
  matchAny: PropTypes.bool,
  minChars: PropTypes.number,
  requestOnlyIfNoOptions: PropTypes.bool,
  spaceRemovers: PropTypes.arrayOf(PropTypes.string),
  spacer: PropTypes.string,
  trigger: PropTypes.string,
  value: PropTypes.string,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
};

const defaultProps = {
  Component: 'textarea',
  defaultValue: '',
  disabled: false,
  maxOptions: 6,
  onBlur: () => { },
  onChange: () => { },
  onKeyDown: () => { },
  onRequestOptions: () => { },
  options: [],
  regex: '^[A-Za-z0-9\\-_]+$',
  matchAny: false,
  minChars: 0,
  requestOnlyIfNoOptions: true,
  spaceRemovers: [',', '.', '!', '?'],
  spacer: ' ',
  trigger: '@',
  offsetX: 0,
  offsetY: -10,
  value: null,
};

class AutocompleteTextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helperVisible: false,
      left: 0,
      matchLength: 0,
      matchStart: 0,
      options: [],
      selection: 0,
      top: 0,
      value: props.value
    };

    this.recentValue = props.defaultValue;
    this.refInput = createRef();
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    const { caret } = this.state;

    if (options.length !== prevProps.options.length) {
      this.updateHelper(this.recentValue, caret, options);
    }
  }

  getMatch(str, caret, providedOptions) {
    const { trigger, matchAny, regex } = this.props;
    const re = new RegExp(regex);
    const triggerLength = trigger.length;
    const triggerMatch = trigger.match(re);

    let last = str[caret - 1];
    // The Quill control I'm using puts things inside of a <p>.  
    // I need to back the caret up to be before it.
    while (last === ">") {
      while (last !== "<") {
        caret--;
        last = str[caret - 1];
      }
      caret--;
      last = str[caret - 1];
    }
    // string change event happens before keydown event with Quill control, 
    // which is preventing tabs from causing selection.
    // This should fix it.
    if (last === "	") {
      caret--;
      last = str[caret - 1];
    }
    for (let i = caret - 1; i >= 0; --i) {
      const substr = str.substring(i, caret);
      const match = substr.match(re);
      let matchStart = -1;

      if (triggerLength > 0) {
        const triggerIdx = triggerMatch ? i : i - triggerLength + 1;

        if (triggerIdx < 0) { // out of input
          return null;
        }

        if (this.isTrigger(str, triggerIdx)) {
          matchStart = triggerIdx + triggerLength;
        }

        if (!match && matchStart < 0) {
          return null;
        }
      } else {
        if (match && i > 0) { // find first non-matching character or begin of input
          continue;
        }
        matchStart = i === 0 && match ? 0 : i + 1;

        if (caret - matchStart === 0) { // matched slug is empty
          return null;
        }
      }

      if (matchStart >= 0) {
        const matchedSlug = str.substring(matchStart, caret);
        const options = providedOptions.filter((slug) => {
          // TODO: Change this to work with object
          const idx = slug.Display.toLowerCase().indexOf(matchedSlug.toLowerCase());
          return idx !== -1 && (matchAny || idx === 0);
        });

        const matchLength = matchedSlug.length;

        return { matchStart, matchLength, options };
      }
    }

    return null;
  }

  isTrigger(str, i) {
    const { trigger } = this.props;

    if (!trigger || !trigger.length) {
      return true;
    }

    if (str.substr(i, trigger.length) === trigger) {
      return true;
    }

    return false;
  }

  handleChange(e) {
    const {
      onChange,
      options,
      spaceRemovers,
      spacer,
      value,
    } = this.props;
    const old = this.recentValue;
    let str = e.target === undefined || e.target.value === undefined ? this.state.value : e.target.value;

    let end = -1;
    if (old.length === 0) {
      end = str.length - 1;
    } else if (str.length === 0) {
      end = 0;
    } else {
      let old2 = old.trim();
      let str2 = str.trim();
      if (old2.substring(old2.length - 6) === "&nbsp;") {
        old2 = old2.substring(0, old2.length - 6);
      }
      if (str2.substring(str2.length - 6) === "&nbsp;") {
        str2 = str2.substring(0, str2.length - 6);
      }
      if (old2 !== str2) {
        // let inSpan = false;
            
        for (let i = 1; i <= Math.min(str2.length, old2.length); i++) {
          if (str2.length < i || old2.length < i || str2[str2.length - i] !== old2[old2.length - i]) {
            end = str2.length - i;
            break;
          }
        }
      }
    }
    const caret = end + 1;

    if (!str.length) {
      this.setState({ helperVisible: false });
    }

    this.recentValue = str;

    this.setState({ caret, value: e });

    if (!str.length || !caret) {
      return onChange(e);
    }

    // '@wonderjenny ,|' -> '@wonderjenny, |'
    if (this.enableSpaceRemovers && spaceRemovers.length && str.length > 2 && spacer.length) {
      for (let i = 0; i < Math.max(old.length, str.length); ++i) {
        if (old[i] !== str[i]) {
          if (
            i >= 2
            && str[i - 1] === spacer
            && spaceRemovers.indexOf(str[i - 2]) === -1
            && spaceRemovers.indexOf(str[i]) !== -1
            && this.getMatch(str.substring(0, i - 2), caret - 3, options) // TODO: Change this to work with objects
          ) {
            const newValue = (`${str.slice(0, i - 1)}${str.slice(i, i + 1)}${str.slice(i - 1, i)}${str.slice(i + 1)}`);

            this.refInput.current.value = newValue;

            if (!value) {
              this.setState({ value: newValue });
            }

            return onChange(newValue);
          }

          break;
        }
      }

      this.enableSpaceRemovers = false;
    }

    this.updateHelper(str, caret, options);

    if (!value) {
      this.setState({ value: e });
    }
    return onChange(e);
  }

  handleKeyDown = (event) => {
    const { helperVisible, options, selection } = this.state;
    const { onKeyDown } = this.props;

    if (helperVisible) {
      switch (event.keyCode) {
        case KEY_ESCAPE:
          event.preventDefault();
          this.resetHelper();
          break;
        case KEY_UP:
          event.preventDefault();
          this.setState({ selection: ((options.length + selection) - 1) % options.length });
          break;
        case KEY_DOWN:
          event.preventDefault();
          this.setState({ selection: (selection + 1) % options.length });
          break;
        case KEY_ENTER:
        case KEY_RETURN:
        case KEY_TAB:
          event.preventDefault();
          this.handleSelection(selection);
          break;
        default:
          onKeyDown(event);
          break;
      }
    } else {
      onKeyDown(event);
    }
  }

  handleSelection(idx) {
    const { matchStart, matchLength, options } = this.state;
    // const { spacer } = this.props;

    // const slug = `<span id='myid' style="color: blue">${options[idx]}</span>`;
    let slug = `<a href='/${options[idx].suggestionType}/details/${options[idx]._id}' rel="noopener noreferrer" target="_blank">${options[idx].Display}</a>`;
    const value = this.recentValue;
    const part1 = value.substring(0, matchStart - 1); // - 1 to remove the @
    const part2 = value.substring(matchStart + matchLength);
    
    if (part2 === "") {
      slug += "&nbsp;";
    }
    this.setState({ value: `${part1}${slug}${part2}` });
    let caret = 0;
    let searched = 0;
    let part1Sub = part1;
    while (searched < part1.length) {
      // I'll need some way in the future to make it so <> can be used in these.
      // Probably something like catching them and putting an escape character before them.
      // Of course then it will also have to do escape characters for escape characters as well.
      // Actually, it looks like I don't.  It's automatically converting < and > to &lt; and &gt;.

      const index = part1Sub.indexOf("<");
      if (index > -1) {
        if (index > 0) 
          caret += index;
        searched += index; // everything before the tag;
        part1Sub = part1Sub.substring(index);
        let openerEndIndex = part1Sub.indexOf(">");
        if (openerEndIndex === -1) {
          // Probably an error because I haven't done the escape character thing yet.
          throw Error("What the Pizza Sauce");
        } else {
          searched += openerEndIndex + 1;
          part1Sub = part1Sub.substring(openerEndIndex + 1);
        }
      } else if (part1Sub.length > 0) {
        searched += part1Sub.length;
        caret += part1Sub.length;
        part1Sub = "";
      }
      if (part1Sub.length === 0 && searched < part1.length) {
        throw Error("OMGOSH");
      }
    }
    caret += options[idx].Display.length;
    this.updateCaretPosition(caret);
  }

  updateCaretPosition(index) {
    setTimeout(() => {
      let input = this.refInput.current;
      
      const editor = input.getEditor();
      const unprivilegedEditor = input.makeUnprivilegedEditor(editor);
      
      const length = unprivilegedEditor.getLength();
      // Caret at the end
      // const range = {
      //   index: length - 1,
      //   length: 0
      // };
      const range = {
        index: Math.max(0, Math.min(index, length-1)),
        length: 0
      };
      unprivilegedEditor.setSelection(range);
    }, 500);
  }

  setValue = (event) => {
    this.setState({ value: event }, _ => { 
      this.handleChange(event);
    });
  }

  updateHelper(str, caret, options) {
    const slug = this.getMatch(str, caret, options);
    if (slug) {
      let input = this.refInput.current;
      let element = input.refInput.current;
      const top = element.clientHeight;
      const left = 0;

      const { minChars, onRequestOptions, requestOnlyIfNoOptions } = this.props;

      if (
        slug.matchLength >= minChars
        && (
          slug.options.length > 1
          || (
            slug.options.length === 1
            && slug.options[0].Display.length !== slug.matchLength
          )
        )
      ) {
        this.setState({
          helperVisible: true,
          top,
          left,
          ...slug,
        });
      } else {
        if (!requestOnlyIfNoOptions || !slug.options.length) {
          onRequestOptions(str.substr(slug.matchStart, slug.matchLength));
        }

        this.resetHelper();
      }
    } else {
      this.resetHelper();
    }
  }

  resetHelper() {
    this.setState({ helperVisible: false, selection: 0 });
  }

  renderAutocompleteList() {
    const {
      helperVisible,
      left,
      matchStart,
      matchLength,
      options,
      selection,
      top,
      value,
    } = this.state;

    if (!helperVisible) {
      return null;
    }

    const { maxOptions, offsetX, offsetY } = this.props;

    if (options.length === 0) {
      return null;
    }

    if (selection >= options.length) {
      this.setState({ selection: 0 });

      return null;
    }

    const optionNumber = maxOptions === 0 ? options.length : maxOptions;

    const helperOptions = options.slice(0, optionNumber).map((val, idx) => {
      const highlightStart = val.Display.toLowerCase().indexOf(value.substr(matchStart, matchLength).toLowerCase());

      return (
        <li
          className={idx === selection ? 'active' : null}
          key={val.Display}
          onClick={() => { this.handleSelection(idx); }}
          onMouseEnter={() => { this.setState({ selection: idx }); }}
        >
          {val.Display.slice(0, highlightStart)}
          <strong>{val.Display.substr(highlightStart, matchLength)}</strong>
          {val.Display.slice(highlightStart + matchLength)}
        </li>
      );
    });

    return (
      <ul className="react-autocomplete-input" style={{ left: left + offsetX, top: top + offsetY }}>
        {helperOptions}
      </ul>
    );
  }

  sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1"],
    allowedAttributes: { a: ["href"] }
  };

  sanitize = (onBlur) => {
    this.setState({ html: sanitizeHtml(this.state.html, this.sanitizeConf) }, onBlur);
  };

  render() {
    return (
      <div style={{position: "relative"}}>
        <ReactQuill 
          theme="snow"
          modules={modules}
          formats={formats} 
          value={this.state.value} 
          onChange={ e => {
              this.setValue(e);
            }
          }
          onBlur={_ => {
            if (this.props.onBlur !== undefined) {
              this.props.onBlur(this.state.value.trim());
            }
          }}
          onKeyDown={this.handleKeyDown}
          ref={this.refInput}
        />
        {this.renderAutocompleteList()}
      </div>
    );
  }
}

AutocompleteTextField.propTypes = propTypes;
AutocompleteTextField.defaultProps = defaultProps;

export default AutocompleteTextField;
