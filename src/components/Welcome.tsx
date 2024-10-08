'use client'

const Welcome = () => {
    return (
        <div className="bg-right bg-cover">
            <div className="container md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                <div className="flex flex-col w-full justify-center lg:items-start overflow-y-hidden">
                    <h1 className="text-3xl md:text-5xl text-indigo-800 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">Bienvenid@ a AdrenalinaStock</h1>
                    <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">El lugar donde podremos llevar el inventario de nuestro negocio!</p>
                </div>
            </div>
            <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
            </div>
        </div>
    )
}

export default Welcome;
