import React, { PropTypes } from 'react';
import TreeView from '../components/TreeView';

const FolderTree = (props) =>
  <TreeView
    items={props.folders}
    selectedItem={props.folder}
    onItemChanged={props.onFolderChanged}
  />;

const propTypes = {
  folders: PropTypes.array.isRequired,
  folder: PropTypes.string.isRequired,
  onFolderChanged: PropTypes.func.isRequired
};

FolderTree.propTypes = propTypes;
export default FolderTree;
