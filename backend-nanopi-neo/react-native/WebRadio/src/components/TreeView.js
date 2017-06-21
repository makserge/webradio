import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uiTheme from '../../MaterialUiTheme';

const FOLDERS_TOP_OFFSET = 280;

const styles = StyleSheet.create({
  tree: {
    height: 130,
    paddingLeft: 10,
  },
  rootNode: {
    paddingBottom: 10,
  },
  Node: {
    paddingTop: 10,
  },
  Item: {
    flexDirection: 'row',
  },
  children: {
    paddingLeft: 25,
  },
  Icon: {
    paddingRight: 10,
    alignSelf: 'center',
  },
  TextSelected: {
    color: uiTheme.palette.accentColor,
  },
});

class TreeView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.selectedItem,
      isEditMode: props.selectedItem !== '',
    };
  }

  getTree = (type, parent, children) => {
    const nodes = [];
    for (let i = 0; i < children.length; i++) {
      nodes.push(this.getNode(type, i, parent, children[i]));
    }
    return nodes;
  };

  getNode = (type, i, parent, node) => {
    let currentNode = '';
    if (parent === '') {
      currentNode = node.title;
    } else if (parent === '/') {
      currentNode = `/${node.title}`;
    } else {
      currentNode = `${parent}/${node.title}`;
    }
    const isSelected = this.state.selectedItem === currentNode;
    return (
      this.state.isEditMode && isSelected ?
      (<View
        style={this.getStyle(type, 'Node')}
        ref="selectedItem"
        key={i}
        onLayout={() => {
            this.refs.selectedItem.measure((x, y, width, height, pageX, pageY) => {
              this.scrollView.scrollTo(
                { x: 0, y: pageY - FOLDERS_TOP_OFFSET, animated: false }
              );
            });
        }}
      >
        <TouchableNativeFeedback
          onPress={() => this.toggleState(type, i, currentNode)}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          {this.getNodeView(type, i, node, isSelected)}
        </TouchableNativeFeedback>
        <View
          style={styles.children}
        >
          {this.getTree('children', currentNode, node.children || [])}
        </View>
      </View>)
      :
      (<View
        key={i}
        style={this.getStyle(type, 'Node')}
      >
        <TouchableNativeFeedback
          onPress={() => this.toggleState(type, i, currentNode)}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          {this.getNodeView(type, i, node, isSelected)}
        </TouchableNativeFeedback>
        <View
          style={styles.children}
        >
          {this.getTree('children', currentNode, node.children || [])}
        </View>
      </View>));
  };

  getStyle = (type, tag) => [styles[tag], styles[type + tag]];

  getNodeView = (type, i, node, isSelected) => {
    const hasChildren = !!node.children;
    let icon;
    if (node.icon) {
      icon = node.icon;
    } else {
      icon = 'keyboard-arrow-down';
    }
    return (
      <View
        style={this.getStyle(type, 'Item')}
      >
        {!hasChildren && !node.icon ?
          null
          :
          <Icon
            style={this.getStyle(type, 'Icon')}
            size={16}
            name={icon}
          />
        }
        <Text
          style={this.getStyle(type, isSelected ? 'TextSelected' : 'Text')}
        >
          {node.title}
        </Text>
      </View>
    );
  }

  toggleState = (type, i, node) => {
    const { onItemChanged } = this.props;
    this.setState({
      selectedItem: node,
      isEditMode: false,
    });
    if (onItemChanged) {
      onItemChanged(node);
    }
  }

  render() {
    const { items } = this.props;
    return (
      <ScrollView
        ref={(ref) => { this.scrollView = ref; }}
        style={styles.tree}
      >
        {this.getTree('root', '', items)}
      </ScrollView>
    );
  }
}

const propTypes = {
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.string.isRequired,
  onItemChanged: PropTypes.func.isRequired,
};

TreeView.propTypes = propTypes;
export default TreeView;
