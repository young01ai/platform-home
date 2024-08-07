

import  {useState} from 'react'
import { Menu, Button } from 'antd'
import {SlidersOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}
const items = [
    getItem('Background', 'Background', <SlidersOutlined />, [
        getItem('首页', 'home', null),
        // getItem('我的', '2', null),
    ])
]

const LeftMenu = () => {
    const onClick = (e) => {
        console.log('click ', e)
    }
    const [collapsed, setCollapsed] = useState(false)

    return <div className='playground-left-menu'>
        <Menu
            onClick={onClick}
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['Background']}
            mode="inline"
            items={items}
            inlineCollapsed={collapsed}
        />
        <Button
            type="text"
            onClick={() => {
                setCollapsed(!collapsed)
            }}
            style={{
                position: 'absolute',
                bottom: 20,
                right: 20
            }}
        >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
    </div>
}

export default LeftMenu