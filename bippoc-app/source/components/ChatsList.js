import React, { Component } from 'react';
import base64 from 'base-64';
import { Actions } from 'react-native-router-flux';
import { View, Text, ListView, TouchableHighlight } from 'react-native';

import { connect } from 'react-redux';
import { fetchContacts } from '../actions/AppActions';

class ChatsList extends Component {
  componentWillMount() {
    this.props.fetchContacts(base64.encode(this.props.email_logged_in));
    this.createDataSource(this.props.contacts);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps.contacts);
  }

  createDataSource(contacts) {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.dataSource = ds.cloneWithRows(contacts);
  }

  renderRow(contact) {
    return (
      <TouchableHighlight
        onPress={() =>
          Actions.chat({
            contactUserId: contact.user.id,
            title: contact.user.name,
            contactName: contact.user.name,
            contactEmail: contact.user.username,
            isLegacy: contact.user.legacy,
            publicKey: contact.user.publicKey,
          })
        }
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: 15,
            borderBottomWidth: 1,
            borderColor: '#b7b7b7',
          }}
        >
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 23, fontWeight: 'bold' }}>{contact.user.name}</Text>
            <Text style={{ fontSize: 13 }}>{contact.user.email}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={data => this.renderRow(data)}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    email_logged_in: state.AppReducer.email_logged_in,
    contacts: state.ListContactsReducer.data,
  };
};

export default connect(mapStateToProps, { fetchContacts })(ChatsList);
