import React from 'react'
import {View} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';

export class DropDown extends PureComponent {
    _handleChange = value => {
      this.props.onChange(this.props.name, value);
    };
    _handleTouch = () => {
      this.props.onTouch(this.props.name);
    };
  
    render() {
      const {label, data, error, style, editable, withIcon, ...rest} = this.props;
      return (
        <View style={[generalStyles.pickerSection, generalStyles.bordernone]}>
          {withIcon ? withIcon : null}
          <View style={generalStyles.dropdown_section}>
            <Dropdown
              label={label}
              data={data}
              inputContainerStyle={{borderBottomColor: 'transparent'}}
              onChangeText={this._handleChange}
              onBlur={this._handleTouch}
              {...rest}
            />
          </View>
        </View>
      );
    }
  }