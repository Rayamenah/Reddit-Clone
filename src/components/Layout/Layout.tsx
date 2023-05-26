import Navbar from '../Navbar/Navbar'

const Layout = ({ children }: any) => {
    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout 