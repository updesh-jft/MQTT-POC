export const mainContants = {
    host : 'broker.emqx.io',
    portData: '1883',
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    username: 'emqx',
    password: 'public',
    topic: '/mqtt/JFT'
}