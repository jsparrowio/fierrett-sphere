import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';
import validator from "validator";
import { Input, Card, Button, Menu } from 'antd';
import { ToastContainer, toast, Slide } from 'react-toastify';
import Auth from '../utils/auth';
import { QUERY_ME } from "../utils/queries";
import { useQuery, useMutation } from "@apollo/client/react";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, LockOutlined, RobotOutlined, TeamOutlined, ProfileOutlined, LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import type { UserProfile } from "../interfaces/UserProfile";
import type { UserPassword } from "../interfaces/UserPassword";
import type { MenuProps } from 'antd';
import type { UserData } from "../interfaces/UserData";
import { CONFIRM_PASSWORD, UPDATE_PASSWORD, UPDATE_PROFILE, DELETE_USER } from "../utils/mutations";

type MenuItem = Required<MenuProps>['items'][number];

interface MeData {
    Me: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
        username: string;
    };
}

const items: MenuItem[] = [
    {
        label: 'Profile',
        key: 'profile',
        icon: <ProfileOutlined />,
    },
    {
        label: 'Password',
        key: 'password',
        icon: <LockOutlined />,
    },
    {
        label: 'Danger Zone',
        key: 'danger',
        icon: <WarningOutlined />,
    },
];

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validatePassword = (value: string) => {

    if (validator.isStrongPassword(value, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
        return true;
    } else {
        return false;
    }
}

const showError = (err: string) => {
    toast.dismiss();
    toast.error(`${err}`,
        {
            transition: Slide,
        });
}

const showWarn = (err: string) => {
    toast.dismiss();
    toast.warn(`${err}`,
        {
            transition: Slide,
        });
}

const showSuccess = (msg: string) => {
    toast.dismiss();
    toast.success(`${msg}`,
        {
            transition: Slide,
        });
}

export default function UserSettingsPage() {
    const [init, setInit] = useState(true);
    const [loginCheck, setLoginCheck] = useState(false);
    const { loading, data, refetch, error } = useQuery<MeData>(QUERY_ME);
    const user = data?.Me as any;
    const [confirmPassword] = useMutation(CONFIRM_PASSWORD);
    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [updatePassword] = useMutation(UPDATE_PASSWORD);
    const [deleteUser] = useMutation(DELETE_USER);

    const navigate = useNavigate();
    const [activeUser, setActiveUser] = useState<UserData>({
        exp: 0,
        iat: 0,
        data: {
            _id: 0,
            username: '',
            first_name: '',
            last_name: '',
            email: ''
        }
    });
    const [initialProfileData, setInitialProfileData] = useState<UserProfile>({
        _id: null,
        username: null,
        first_name: null,
        last_name: null,
        email: null,
        createdAt: null,
        updatedAt: null
    });
    const [profileData, setProfileData] = useState<UserProfile>({
        _id: null,
        username: null,
        first_name: null,
        last_name: null,
        email: null,
        createdAt: null,
        updatedAt: null
    });

    useEffect(() => {
        const loggedIn = Auth.loggedIn();
        if (loggedIn === true) {
            if (data) {
                setInitialProfileData(user);
                setProfileData(user);
                setEmailConfirm(user.email);
            }
        }
    }, [data]);

    useEffect(() => {
        const loggedIn = Auth.loggedIn();
        if (loggedIn === true) {
            const profile = Auth.getProfile();
            setInit(false);
            setActiveUser(profile);
            setLoginCheck(true);
            if (data) {
                setInitialProfileData(user);
                setProfileData(user);
                setEmailConfirm(user.email);
            }
        } else {
            setInit(false);
            Auth.logout();
            navigate('/login');
        }
    }, []);

    const [usernameBlur, setUsernameBlur] = useState(false);
    const [firstNameBlur, setFirstNameBlur] = useState(false);
    const [lastNameBlur, setLastNameBlur] = useState(false);
    const [emailBlur, setEmailBlur] = useState(false);
    const [emailConfirmBlur, setEmailConfirmBlur] = useState(false);
    const [currentPasswordBlur, setCurrentPasswordBlur] = useState(false);
    const [passwordBlur, setPasswordBlur] = useState(false);
    const [passwordConfirmBlur, setPasswordConfirmBlur] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    // const [confirmTeamReset, setConfirmTeamReset] = useState(false);

    const handleUsernameBlur = () => {
        profileData.username === '' ? setUsernameBlur(true) : setUsernameBlur(false);
    };
    const handleFirstNameBlur = () => {
        profileData.first_name === '' ? setFirstNameBlur(true) : setFirstNameBlur(false);
    };
    const handleLastNameBlur = () => {
        profileData.last_name === '' ? setLastNameBlur(true) : setLastNameBlur(false);
    };
    const handleEmailBlur = () => {
        profileData.email === '' ? setEmailBlur(true) : setEmailBlur(false);
    };
    const handleEmailConfirmBlur = () => {
        emailConfirm === '' ? setEmailConfirmBlur(true) : setEmailConfirmBlur(false);
    };
    const handleCurrentPasswordBlur = () => {
        passwordData.currentPassword === '' ? setCurrentPasswordBlur(true) : setCurrentPasswordBlur(false);
    };
    const handlePasswordBlur = () => {
        passwordData.password === '' ? setPasswordBlur(true) : setPasswordBlur(false);
    };
    const handlePasswordConfirmBlur = () => {
        passwordConfirm === '' ? setPasswordConfirmBlur(true) : setPasswordConfirmBlur(false);
    };

    const [current, setCurrent] = useState('profile');

    const onClick: MenuProps['onClick'] = (e) => {
        toast.dismiss();
        setCurrent(e.key);
    };

    const [passwordData, setPasswordData] = useState<UserPassword>({
        id: activeUser.data._id,
        currentPassword: '',
        password: ''
    });

    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [emailConfirm, setEmailConfirm] = useState<string | null>('');

    // const checkCurrentEmail = () => {
    //     if (emailConfirm === '' || emailConfirm !== activeUser.userData.email) {
    //         return true;
    //     } else {
    //         return false;
    //     } 
    // }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.password || !passwordConfirm) {
            showWarn('All fields must be completed');
            return;
        }
        if (passwordData.password !== passwordConfirm) {
            showError('New passwords must match');
            setPasswordBlur(true);
            setPasswordConfirmBlur(true);
            return;
        }
        if (!validatePassword(passwordData.password)) {
            showError('Password does not meet requirements of: At least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol');
            setPasswordBlur(true);
            return;
        }
        try {
            await confirmPassword({
                variables: { currentPassword: passwordData.currentPassword },
            })
            await updatePassword({
                variables: { password: passwordData.password },
            });
            console.log('Password update success!');
            showSuccess('Password updated successfully!');
            setPasswordData({
                id: activeUser.data._id,
                currentPassword: '',
                password: ''
            });
            setPasswordConfirm('');
        } catch (err: any) {
            if (err.errors.length > 0) {
                console.error('Failed to change password;', err.errors[0].message);
                if (err.errors[0].message === "Username or password incorrect") {
                    showError('Current password was incorrect!');
                } else if (err.errors[0].message === "User not found. Was the intention to signup?") {
                    showError('User not found. Please contact site admin for more support!');
                } else {
                    showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
                }
            } else {
                console.error('Failed to change password', err);
                showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
            }
            setPasswordData({
                id: activeUser.data._id,
                currentPassword: '',
                password: ''
            });
            setPasswordConfirm('');
        }
    };

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        name === 'email' && profileData.email !== initialProfileData.email ? setEmailConfirm('') : setEmailConfirm(profileData.email);
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { target } = e;
        const inputType = target.name;
        const inputValue = target.value;

        if (inputType === 'confirmPassword') {
            setPasswordConfirm(inputValue);
        } else if (inputType === 'confirmEmail') {
            setEmailConfirm(inputValue);
        }
    };

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!profileData.username || !profileData.first_name || !profileData.last_name || !profileData.email || !emailConfirm) {
            showWarn('All fields must be completed');
            return;
        }
        if (profileData.email !== emailConfirm) {
            showWarn('Email must match');
            return;
        }
        if (!validateEmail(profileData.email)) {
            showError('Email is invalid');
            return;
        }
        if (
            profileData.username === initialProfileData.username
            &&
            profileData.first_name === initialProfileData.first_name
            &&
            profileData.last_name === initialProfileData.last_name
            &&
            profileData.email === initialProfileData.email
        ) {
            showWarn('No information was changed, so no updates were made');
            setEmailBlur(false);
            setUsernameBlur(false);
            return;
        }
        try {
            const newProfile = {
                username: profileData.username,
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                email: profileData.email
            }
            await updateProfile({
                variables: { input: { ...newProfile } },
            });
            console.log('Profile update success!');
            showSuccess('Profile updated successfully!');
            refetch();
            setEmailBlur(false);
            setUsernameBlur(false);
        } catch (err: any) {
            if (err.errors.length > 0) {
                console.error('Failed to change password;', err.errors[0].message);
                if (err.errors[0].message === "Error updating user: Username already exist") {
                    showError('Username already exist, please choose another');
                } else if (err.errors[0].message === "Error updating user: Email already exist") {
                    showError('Email already exist, please choose another');
                } else {
                    showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
                }
            } else {
                console.error('Failed to change password', err);
                showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
            }
        }
    };

    // const handleBoxReset = async () => {
    //     if (!passwordData.currentPassword) {
    //         showWarn('You must enter your password to continue');
    //         return;
    //     }
    //     try {
    //         await confirmPassword({
    //             variables: { currentPassword: passwordData.currentPassword },
    //         })
    //         await resetBox({
    //             variables: { id: profileData._id },
    //         });
    //         showSuccess('Box reset successfully!');
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //         refetch();
    //         setConfirmBoxReset(false);
    //     } catch (err: any) {
    //         if (err.errors.length > 0) {
    //             console.error('Failed to reset box', err.errors[0].message);
    //             if (err.errors[0].message === "Username or password incorrect") {
    //                 showError('Current password was incorrect!');
    //             } else {
    //                 showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //             }
    //         } else {
    //             console.error('Failed to reset box', err);
    //             showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //         }
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //     }
    // }

    // const handleTeamReset = async () => {
    //     if (!passwordData.currentPassword) {
    //         showWarn('You must enter your password to continue');
    //         return;
    //     }
    //     try {
    //         await confirmPassword({
    //             variables: { currentPassword: passwordData.currentPassword },
    //         })
    //         await resetTeam({
    //             variables: { id: profileData._id },
    //         });
    //         showSuccess('Team reset successfully!');
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //         refetch();
    //         setConfirmTeamReset(false);
    //     } catch (err: any) {
    //         if (err.errors.length > 0) {
    //             console.error('Failed to reset team', err.errors[0].message);
    //             if (err.errors[0].message === "Username or password incorrect") {
    //                 showError('Current password was incorrect!');
    //             } else {
    //                 showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //             }
    //         } else {
    //             console.error('Failed to reset team', err);
    //             showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //         }
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //     }
    // }

    // const handleInventoryReset = async () => {
    //     if (!passwordData.currentPassword) {
    //         showWarn('You must enter your password to continue');
    //         return;
    //     }
    //     try {
    //         await confirmPassword({
    //             variables: { currentPassword: passwordData.currentPassword },
    //         })
    //         await resetInventory({
    //             variables: { id: profileData._id },
    //         });
    //         showSuccess('Inventory reset successfully!');
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //         refetch();
    //         setConfirmInventoryReset(false);
    //     } catch (err: any) {
    //         if (err.errors.length > 0) {
    //             console.error('Failed to reset inventory', err.errors[0].message);
    //             if (err.errors[0].message === "Username or password incorrect") {
    //                 showError('Current password was incorrect!');
    //             } else {
    //                 showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //             }
    //         } else {
    //             console.error('Failed to reset inventory', err);
    //             showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
    //         }
    //         setPasswordData({
    //             id: activeUser.data._id,
    //             currentPassword: '',
    //             password: ''
    //         });
    //     }
    // }

    const handleAccountDelete = async () => {
        if (!passwordData.currentPassword) {
            showWarn('You must enter your password to continue');
            return;
        }
        try {
            await confirmPassword({
                variables: { currentPassword: passwordData.currentPassword },
            })
            await deleteUser({
                variables: { id: profileData._id },
            });
            showSuccess('Account deleted successfully!');
            setPasswordData({
                id: activeUser.data._id,
                currentPassword: '',
                password: ''
            });
            Auth.logout();
            navigate('/login');
        } catch (err: any) {
            if (err.errors.length > 0) {
                console.error('Failed to delete account', err.errors[0].message);
                if (err.errors[0].message === "Username or password incorrect") {
                    showError('Current password was incorrect!');
                } else {
                    showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
                }
            } else {
                console.error('Failed to delete account', err);
                showError(`Oops! Something went wrong! If this continues, please contact the site administrator. Error code: ${err}`);
            }
            setPasswordData({
                id: activeUser.data._id,
                currentPassword: '',
                password: ''
            });
        }
    }


    if (loading) return (
        <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'margin': '3rem' }}>
            <Card variant={"outlined"} style={{ width: 300 }}>
                <p>
                    <LoadingOutlined /> Loading...
                </p>
            </Card>
        </div>
    )
    if (error) return (
        <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'margin': '3rem' }}>
            <Card variant={"outlined"} style={{ width: 300 }}>
                <p>Loading error: {JSON.stringify(error)}</p>
            </Card>
        </div>
    )
    return (
        <>
            <div style={{ 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center', 'margin': '3rem' }}>
                <Card variant={"outlined"} style={{ width: '30rem' }}>
                    <ToastContainer
                        position="top-center" style={{ zIndex: "99999"}} />
                    {loginCheck === true &&
                        <>
                            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} />
                            <br />
                            {current === 'profile' &&
                                <form className='form' onSubmit={handleProfileSubmit} style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center' }}>


                                    <h2>Change your profile information</h2>
                                    <label>Username</label>
                                    <Input
                                        size="large"
                                        status={usernameBlur ? 'error' : ''}
                                        placeholder=''
                                        prefix={<RobotOutlined />}
                                        type='text'
                                        name='username'
                                        value={profileData.username || ''}
                                        onChange={handleProfileChange}
                                        onBlur={handleUsernameBlur}
                                    />
                                    <label>First Name</label>
                                    <Input
                                        size="large"
                                        status={firstNameBlur ? 'error' : ''}
                                        placeholder=''
                                        prefix={<UserOutlined />}
                                        type='text'
                                        name='first_name'
                                        value={profileData.first_name || ''}
                                        onChange={handleProfileChange}
                                        onBlur={handleFirstNameBlur}
                                    />
                                    <label>Last Name</label>
                                    <Input
                                        size="large"
                                        status={lastNameBlur ? 'error' : ''}
                                        placeholder=''
                                        prefix={<TeamOutlined />}
                                        type='text'
                                        name='last_name'
                                        value={profileData.last_name || ''}
                                        onChange={handleProfileChange}
                                        onBlur={handleLastNameBlur}
                                    />
                                    <label>Email</label>
                                    <Input
                                        size="large"
                                        status={emailBlur ? 'error' : ''}
                                        placeholder=''
                                        prefix={<MailOutlined />}
                                        type='email'
                                        name='email'
                                        value={profileData.email || ''}
                                        onChange={handleProfileChange}
                                        onBlur={handleEmailBlur}
                                    />

                                    <label>Confirm Email</label>
                                    <Input
                                        size="large"
                                        status={emailConfirmBlur ? 'error' : ''}
                                        placeholder=''
                                        prefix={<MailOutlined />}
                                        type='email'
                                        name='confirmEmail'
                                        value={emailConfirm || ''}
                                        onChange={handleInputChange}
                                        onBlur={handleEmailConfirmBlur}
                                    />
                                    <div style={{ margin: "3px" }}></div>
                                    <Button size="large" variant="solid" color="default" htmlType="submit">Change Info</Button>
                                </form>}
                            {current === 'password' &&
                                <form className='form' onSubmit={handlePasswordSubmit} style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center' }}>

                                    <h2>Change Password</h2>
                                    <label>Current Password</label>
                                    <Input.Password
                                        size="large"
                                        status={currentPasswordBlur ? 'error' : ''}
                                        placeholder="Current Password"
                                        prefix={<LockOutlined />}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        type='password'
                                        name='currentPassword'
                                        value={passwordData.currentPassword || ''}
                                        onChange={handlePasswordChange}
                                        onBlur={handleCurrentPasswordBlur}
                                    />
                                    <label>New Password</label>
                                    <Input.Password
                                        size="large"
                                        status={passwordBlur ? 'error' : ''}
                                        placeholder="New Password"
                                        prefix={<LockOutlined />}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        type='password'
                                        name='password'
                                        value={passwordData.password || ''}
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordBlur}
                                    />
                                    <label>Confirm Password</label>
                                    <Input.Password
                                        size="large"
                                        status={passwordConfirmBlur ? 'error' : ''}
                                        placeholder="Confirm New Password"
                                        prefix={<LockOutlined />}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        type='password'
                                        name='confirmPassword'
                                        value={passwordConfirm || ''}
                                        onChange={handleInputChange}
                                        onBlur={handlePasswordConfirmBlur}
                                    />
                                    <div style={{ margin: "3px" }}></div>
                                    <Button size="large" variant="solid" color="default" htmlType="submit">Change Password</Button>
                                </form>}
                            {current === 'danger' &&
                            <form className='form' onSubmit={(e) => e.preventDefault()} style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'alignItems': 'center' }}>

                                    <h2>Danger Zone!</h2>
                                    {/* <label><h3>Team</h3></label>
                                    <p>Current Team Count: {user.teamCount}</p>
                                    <Button key='reset-team' variant="solid" color="red" onClick={() => setConfirmTeamReset(true)}>Reset Team</Button> */}
                                    <label><h3>Delete Account</h3></label>
                                <Button key='delete-account' variant="solid" color="red" htmlType="button" onClick={() => setConfirmDelete(true)}>Delete Account</Button>
                                </form>}
                        </>
                    }
                    {loginCheck === false && init === false &&
                        <div>
                            <p>
                                You must be logged in to view this page!
                                <br />
                                Redirecting...
                            </p>
                        </div>
                    }
                </Card>
            </div>
            {/* {confirmTeamReset && (
                <div className="modal">
                    <Card variant={"outlined"} style={{ width: 300 }} className="deletemodal">
                        <h2>Are you sure you want to reset your team to no Pokemon?</h2>
                        <h2>Disclaimer: This will <b>NOT</b> move your team to your box, it will <b>permanently release</b> the Pokemon</h2>
                        <h2>NOTE: THIS ACTION CANNOT BE UNDONE</h2>
                        <label>Password</label>
                        <Input.Password
                            size="large"
                            status={currentPasswordBlur ? 'error' : ''}
                            placeholder="Password"
                            prefix={<LockOutlined />}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            type='password'
                            name='currentPassword'
                            value={passwordData.currentPassword || ''}
                            onChange={handlePasswordChange}
                            onBlur={handleCurrentPasswordBlur}
                        />
                        <div style={{ margin: "3px" }}></div>
                        <Button key='team-reset-confirm' variant="solid" color="red" onClick={() => handleTeamReset() }>Reset Team</Button>
                        <br />
                        <div style={{ margin: "3px" }}></div>
                        <Button key='cancel-team-reset' variant="solid" color="default" onClick={() => { setConfirmTeamReset(false); toast.dismiss(); }}>Cancel</Button>
                    </Card>
                </div>
            )
            }
            */}
            {confirmDelete && (
                <div className="modal">
                    <Card variant={"outlined"} style={{ width: 300 }} className="deletemodal">
                        <h1>Are you sure you want to delete your account?</h1>
                        <h2>NOTE: THIS ACTION CANNOT BE UNDONE AND ALL OF YOUR DATA WILL BE LOST</h2>
                        <label>Password</label>
                        <Input.Password
                            size="large"
                            status={currentPasswordBlur ? 'error' : ''}
                            placeholder="Password"
                            prefix={<LockOutlined />}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            type='password'
                            name='currentPassword'
                            value={passwordData.currentPassword || ''}
                            onChange={handlePasswordChange}
                            onBlur={handleCurrentPasswordBlur}
                        />
                        <div style={{ margin: "3px" }}></div>
                        <Button key='delete-confirm' variant="solid" color="red" onClick={() => handleAccountDelete()}>Delete Account</Button>
                        <br />
                        <div style={{ margin: "3px" }}></div>
                        <Button key='cancel-delete' variant="solid" color="default" onClick={() => { setConfirmDelete(false); toast.dismiss(); }}>Cancel</Button>
                    </Card>
                </div>
            )
            }
        </>
    )
}