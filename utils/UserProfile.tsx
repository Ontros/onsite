import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react"
import Image from 'next/image'
import styles from '../styles/userProfile.module.css';

export default function userProfile(props: { session: Session | null }) {
    const { session } = props
    if (!session) {
        return (
            <button onClick={() => { signIn() }}>Log in!</button>
        )
    }
    return (
        <div className={styles["userProfileContainer"]} onClick={() => { if (confirm("Do you want to log out?")) { signOut() } }}>
            <div className={styles["avatarContainer"]}>
                {session?.user?.image ? <Image className={styles["userAvatar"]} layout='fill' objectFit="contain" src={session?.user?.image}
                    alt="Profile Pic"
                /> : ""}
            </div>
            {session.user?.name}
        </div>
    )
}