/**
 * The DB instance will be show in new tab.
 */

import React from 'react';
import { connect } from 'react-redux';
import { Button, Layout, Tree, notification, List, Select } from 'antd';
import { addInstance, getInstance } from '../redux/thunk/Instance';
import { getCurrentInstanceKeys, getConfigByKey, setConfig, getObjectByKey } from '../redux/thunk/Redis';

const { Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

class Instance extends React.PureComponent {
    state = {
        currentKey: null,
        currentValue: null
    }

    constructor(props) {
        super(props)

        this.curInstance = this.props.curInstance;
    }

    getStr() {
        //this.props.getString('test');
        //notification.open({ message: "Get a string!!!" });
    }

    constructDBTree() {
        const { config } = this.props;

        if (!config) {
            return;
        }

        let treeNodes = [];
        for (let i = 1; i <= parseInt(config.value); i++) {
            treeNodes.push(<TreeNode title={`DB${i}`} key={`${i}`}></TreeNode>);
        }

        return treeNodes;
    }

    constructOptions() {
        const { config } = this.props;

        if (!config) {
            return;
        }

        let options = [];
        for (let i = 1; i <= parseInt(config.value); i++) {
            options.push(<Option key={`${i}`} value={`DB${i}`}>{`DB${i}`}</Option>)
        }

        return options;
    }

    constructKeys() {
        const { keys } = this.props;

        if (!keys) {
            return;
        }

        let items = [];
        for (let i = 0; i < keys.length; i++) {
            items.push(<li key={`${i}`} onClick={() => this.onSelectKey(`${keys[i]}`)}><span></span><span>{`${keys[i]}`}</span></li>)
        }

        return items;
    }

    onSelectKey = (key) => {
        this.setState({ currentKey: key });
        this.props.getObjectByKey(key);
    }

    onSelectNode = (keys, info) => {
        console.log(keys, info);
    }

    render() {
        const { currentKey } = this.state;
        const { instance, keys, config, obj } = this.props;

        return (
            <Layout>
                <Sider style={styles.sider}>
                    <Select style={{ width: '100%' }} defaultValue="DB1">
                        {this.constructOptions()}
                    </Select>
                    <ul style={{ background: 'green' }}>
                        {this.constructKeys()}
                    </ul>
                </Sider>
                <Content style={{ marginLeft: '200px', minHeight: '100%' }}>
                    <div style={styles.topBar}>
                        <div style={{ float: 'left' }}> {obj && obj.type} </div>
                        <Select style={{ width: 90, float: 'right' }}>
                            <Option key='0'>RAW</Option>
                            <Option key='1'>JSON</Option>
                        </Select>
                    </div>
                    <div style={{ width: '100%', minHeight: '100%', position: 'relative' }}>
                        <textarea style={{ width: '100%' }}>{obj && obj.value}</textarea>
                    </div>
                    <div style={styles.topBar}>
                        <Button type="primary" onClick={() => this.addStr()}>Delete</Button>
                        <Button type="primary" onClick={() => this.getStr()}>Update</Button>
                    </div>
                </Content>
            </Layout>
        )
    }

    componentDidMount() {
        this.props.getConfigByKey("databases");
        this.props.getCurrentInstanceKeys();
    }
}

function mapStateToProps(state) {
    return {
        obj: state.handleRedis.obj || null,
        config: state.handleRedis.config || null,
        keys: state.handleRedis.keys || null,
        instance: state.handleConnection.client || null
    }
}

export default connect(mapStateToProps, { getConfigByKey, setConfig, getCurrentInstanceKeys, getObjectByKey })(Instance);

const styles = {
    topBar: {
        width: '100%',
        height: '32px',
        background: 'yellow'
    },
    sider: {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        border: 'solid 1 silver',
        background: "white"
    }
}