export default function Header() {
    return (
        <div className="flex justify-around items-center" style={ {height: "80px"}} >
            <div className="flex app-icon justify-center items-center">
                <h1 className="text-3xl font-bold text-center py-4"> Yo</h1>
            </div>
            <div className="flex app-icon justify-center w-4/8 items-center">
                <h1 className=" font-bold text-center py-4">Lazy Pilot</h1>
            </div>
            <div className="flex app-icon justify-center items-center">
                <h1 className="text-3xl font-bold text-center py-4"> Yo</h1>
            </div>
        </div>
    )
}