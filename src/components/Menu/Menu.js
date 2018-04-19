import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import omit from 'lodash/omit';

import { Button, ClickOutside, IconButton } from '../../';

// https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types#is-it-safe
const propTypes = {
  /**
   * The button that triggers the dropdown menu
   * ```
   * {
   *    icon: 'settings',
   *    sprite: 'utility',
   *    title: 'Click me',
   *    noBorder: true,
   * }
   * ```
   */
  button: PropTypes.shape({
    brand: PropTypes.bool,
    icon: PropTypes.string.isRequired,
    neutral: PropTypes.bool,
    noBorder: PropTypes.bool,
    sprite: PropTypes.string.isRequired,
    title: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  /**
   * one MenuList or many of them
   */
  children: PropTypes.node.isRequired,
  /**
   * class name
   */
  className: PropTypes.string,
  /**
   * fully customizable dropdown trigger button, use this instead of the button
   * shape if needed
   */
  customButton: PropTypes.element,
  /**
   * adds disabled attribute to menu button
   */
  disabled: PropTypes.bool,
  /**
   * forces open or closed state, is needed when using a custom button
   */
  isOpen: PropTypes.bool,
  /**
   * indicates that this is the last element inside a button group and renders
   * the required css class
   */
  last: PropTypes.bool,
  /**
   * displays the nubbin at the correct position if true, hidden per default
   */
  nubbin: PropTypes.bool,
  /**
   * position relative to the menu button
   */
  position: PropTypes.oneOf(['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']),
  /**
   * length of the menu box
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * indicates if the menu closes automatically on an outside click
   */
  closeOnClickOutside: PropTypes.bool,
};

export class MenuRaw extends Component {
  static propTypes = propTypes

  static defaultProps = {
    button: null,
    className: null,
    customButton: null,
    disabled: false,
    isOpen: false,
    last: false,
    nubbin: false,
    position: 'top-left',
    size: 'small',
    closeOnClickOutside: false,
  }

  constructor(props, { cssPrefix }) {
    super(props, { cssPrefix });
    this.state = { open: this.props.isOpen };
  }

  onClickOutside = () => this.setState({ open: false });

  getClasses() {
    if (!this.props.isOpen && !this.state.open) {
      return this.classes;
    }

    return [...this.classes, 'slds-is-open'];
  }

  toggle = () => {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  button = () => {
    const { button, customButton, disabled } = this.props;

    if (customButton) return customButton;

    let buttonFlavor = null;

    if (button.brand) { buttonFlavor = 'brand'; }
    if (button.neutral) { buttonFlavor = 'neutral'; }

    if (!button.title) {
      return (
        <IconButton
          aria-haspopup="true"
          icon={button.icon}
          disabled={disabled}
          flavor={buttonFlavor}
          onClick={this.toggle}
          sprite={button.sprite}
          border={button.noBorder ? null : 'filled'}
          container={button.noBorder}
          title={button.tooltip}
        />
      );
    }

    return (
      <Button
        aria-haspopup="true"
        flavor={buttonFlavor}
        icon={button.icon}
        iconPosition="right"
        sprite={button.sprite}
        onClick={this.toggle}
        title={button.title}
      />
    );
  }

  render() {
    const {
      children,
      className,
      last,
      nubbin,
      position,
      size,
      closeOnClickOutside,
    } = this.props;
    const { open } = this.state;

    this.classes = [
      'slds-dropdown-trigger',
      'slds-dropdown-trigger_click',
      { 'slds-button_last': last },
    ];

    this.dropdownClasses = [
      'slds-dropdown',
      { [`slds-dropdown_${size}`]: size },
      { 'slds-dropdown_left': position.endsWith('left') },
      { 'slds-dropdown_right': position.endsWith('right') },
      { 'slds-dropdown_bottom': position.startsWith('bottom') },
      { [`slds-nubbin_${position}`]: nubbin },
      className,
    ];

    const rest = omit(this.props, Object.keys(propTypes));

    const condition = closeOnClickOutside && open;

    return (
      <div className={cx(this.getClasses())}>
        <ClickOutside onClickOutside={this.onClickOutside} condition={condition}>
          {this.button()}
          <div {...rest} className={cx(this.dropdownClasses)}>
            {children}
          </div>
        </ClickOutside>
      </div>
    );
  }
}

const Menu = props => <MenuRaw closeOnClickOutside {...props} />;

export default Menu;
