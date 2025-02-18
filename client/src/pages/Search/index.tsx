import {MainLayout} from "@/pages";
import {ContactList} from "@/components";
import {Hash, Search} from "lucide-react";
import {Input} from "@/components/ui";
import {useState} from "react";

const SearchPage = () => {

    const [keyword, setKeyword] = useState<string>('')
    const [tag, setTag] = useState<string>('')

    return <MainLayout>
        <div className='h-full flex flex-1 justify-center text-white'>
            <div className='min-w-[640px] w-[80%] my-6'>
                <div className='w-full h-full rounded-xl flex flex-col items-center mb-3 p-6 bg-[#181818] overflow-y-scroll no-scrollbar'>
                    <div className='flex rounded-xl overflow-hidden mb-6 w-full border-blue-500 border bg-black'>
                        <div className='flex h-10 flex-1 items-center'>
                            <div className='flex w-10 justify-center items-center'>
                                <Search size={24} color='#777777'/>
                            </div>
                            <Input style={{ boxShadow: 'none' }} className='flex-1 border-0 border-r !rounded-r-none border-blue-500' value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                        </div>
                        <div className='flex w-40 items-center'>
                            <div className='flex w-10 justify-center items-center'>
                                <Hash size={24} color='#777777'/>
                            </div>
                            <Input style={{ boxShadow: 'none' }} className='flex-1 border-0 shadow-transparent' value={tag} onChange={(e) => setTag(e.target.value)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ContactList/>
    </MainLayout>
}

export default SearchPage;