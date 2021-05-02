import {Button, Input} from '@ui-kitten/components';
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
} from 'react-native';
import profileStore from '../../store/profile.store';


export const Login = () => {
    const [username, setUsername] = React.useState<string>(profileStore.username)
    const [password, setPassword] = React.useState<string>()
    const [loginDisabled, setLoginDisabled] = React.useState(false)
    const [eraseDisabled, setEraseDisabled] = React.useState(false)

    const img = require('../../../assets/camera.png')

    function login() {
        setLoginDisabled(true)
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                credentials: 'include'
            },
            body: JSON.stringify({username: username, password: password}),
        }

        fetch('http://6398750230bb.ngrok.io/auth/login', requestOptions)
            .then(res => res.json())
            .then(async data => {
                if (data.username) {
                    console.log("Logged: " + data.username)
                    await profileStore.login(data.username)
                } else {
                    alert("Something wrong...")
                    setUsername("")
                    setPassword("")
                    setLoginDisabled(false)
                }
            })
    }

    async function erase() {
        setEraseDisabled(true)
        await profileStore.erase()
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Image
                    source={img}
                    style={styles.headingImage}
                    resizeMode={"contain"}
                />
                <Text style={styles.greeting}>
                    Welcome back, {profileStore.username}
                </Text>
                <Text style={styles.greeting2}>
                    sign in to continue
                </Text>
                <View style={styles.inputContainer}>
                    {profileStore.username == '' ?
                        <Input
                            placeholder={"Username"}
                            value={username}
                            onChangeText={nextValue => setUsername(nextValue)}
                        />
                        :
                        <Input
                            value={username}
                            disabled={true}
                        />
                    }
                    <Input
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={nextValue => setPassword(nextValue)}
                    />
                </View>
                <Button style={styles.login} appearance={"outline"} disabled={loginDisabled} onPress={login}>
                    Login
                </Button>
            </View>

            {profileStore.username != '' &&
            <Button style={styles.erase} appearance={"outline"} status={"danger"} disabled={eraseDisabled}
                    onPress={erase}>
                Erase videos from device and sign out
            </Button>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: "center",
    },
    form: {
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf: "center",
        paddingTop: 100
    },
    headingImage: {
        width: 50,
        height: 50
    },
    greeting: {
        fontSize: 24,
    },
    greeting2: {
        color: '#666',
        fontSize: 24,
        marginTop: 5,
    },
    inputContainer: {
        marginTop: 20
    },
    login: {
        marginTop: 10,
    },
    erase: {
        marginBottom: 10
    }
});