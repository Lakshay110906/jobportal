import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useAuth,useUser} from '@clerk/clerk-react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const {user} = useUser()
    const {getToken} = useAuth()

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData , setUserData]  = useState(null)
    const [userApplications,setUserApplications] = useState([])

    //  Function to fetch jobs
    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/jobs')
            if(data.success){
                setJobs(data.jobs)
                console.log(data)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch companyData
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })

            if(data.success){
                setCompanyData(data.company)
                console.log(data)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async() => {
        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/users/user',{headers : {Authorization : `Bearer ${token}`}})

            if(data.success){
                setUserData(data.user)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to fetch users applied application Data
    const fetchUserApplications = async() => {
        try {
            const token = await getToken()

            const {data}  = await axios.get(backendUrl + '/api/users/applications',{headers:{Authorization : `Bearer ${token}`}})

            if(data.success){
                setUserApplications(data.applications)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        fetchJobs()
        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
    }, [])

    useEffect(()=>{
        if(companyToken){
            fetchCompanyData()
        }
        
    },[companyToken])

    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])

    const value = {
        setSearchFilter, searchFilter, isSearched, setIsSearched, jobs, setJobs, showRecruiterLogin, setShowRecruiterLogin, companyData, setCompanyData, companyToken, setCompanyToken, backendUrl,userData,userApplications,setUserData,setUserApplications,fetchUserData,fetchUserApplications
    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}