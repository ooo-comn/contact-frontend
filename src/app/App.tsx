import { postEvent } from '@telegram-apps/sdk'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
// import EditCourse from '../pages/Create/EditCourse'
import { VerificationForm } from 'src/entities/verification/ui/VerificationForm/VerificationForm'
import ConnectCard from 'src/pages/ConnectCard/ConnectCard'
import EditProfile from 'src/pages/EditProfile/EditProfile'
import FeedbackPage from 'src/pages/FeedbackPage/FeedbackPage'
import LandingPage from 'src/pages/LandingPage/LandingPage'
import LegalPage from 'src/pages/LegalPage/LegalPage'
import PaymentPage from 'src/pages/PaymentPage/PaymentPage'
import RegistrationPage from 'src/pages/RegistrationPage/RegistrationPage'
import SellerProfile from 'src/pages/UserProfile/ui/SellerProfile'
import Wallet from 'src/pages/Wallet/Wallet'
import Feed from '../pages/Feed/Feed'
import useTheme from '../shared/hooks/useTheme'
import './App.css'

function App() {
	const [hasRedirected, setHasRedirected] = useState(false)
	// const [hasReloaded, setHasReloaded] = useState(false)

	const { theme } = useTheme()
	console.log('theme', theme)

	// const tg: any = window.Telegram
	// tg.WebApp.expand()
	// tg.WebApp.enableClosingConfirmation()
	const navigate = useNavigate()

	useEffect(() => {
		const script = document.createElement('script')
		script.src = 'https://telegram.org/js/telegram-web-app.js'
		script.async = true
		document.body.appendChild(script)
		console.log('script', script)

		script.onload = () => {
			console.log('Telegram Web App script loaded')

			if (window.Telegram?.WebApp) {
				const webApp = window.Telegram.WebApp

				webApp.ready()

				webApp.expand()

				if (
					window.Telegram.WebView.initParams.tgWebAppPlatform !== 'tdesktop' &&
					window.Telegram.WebView.initParams.tgWebAppPlatform !== 'macos' &&
					window.Telegram.WebView.initParams.tgWebAppPlatform !== 'weba'
				) {
					postEvent('web_app_request_fullscreen')
				}

				if (webApp.isVerticalSwipesEnabled) {
					webApp.disableVerticalSwipes()
					console.log('Vertical swipes disabled')
				} else {
					console.log('Vertical swipes were already disabled')
				}

				webApp.enableClosingConfirmation()
			}
		}

		return () => {
			document.body.removeChild(script)
		}
	}, [])

	useEffect(() => {
		document.body.classList.add('mobile-body')
		document.getElementById('wrap')?.classList.add('mobile-wrap')
		document.getElementById('content')?.classList.add('mobile-content')
	}, [])

	// useEffect(() => {
	// 	const script = document.createElement('script')
	// 	script.src = 'https://telegram.org/js/telegram-web-app.js'
	// 	script.async = true
	// 	document.body.appendChild(script)

	// 	script.onload = () => {
	// 		console.log('Telegram Web App script loaded')
	// 		console.log(window.Telegram.WebApp)
	// 	}

	// 	return () => {
	// 		document.body.removeChild(script)
	// 	}
	// }, [])

	// useEffect(() => {
	// 	if (window.Telegram?.WebApp) {
	// 		const webApp = window.Telegram.WebApp

	// 		window.Telegram.WebApp.ready()

	// 		postEvent('web_app_request_fullscreen')

	// 		if (webApp.isVerticalSwipesEnabled) {
	// 			webApp.disableVerticalSwipes()
	// 		}

	// 		webApp.enableClosingConfirmation()
	// 	}
	// }, [])

	useEffect(() => {
		if (hasRedirected) return

		const urlParams = new URLSearchParams(window.Telegram.WebApp.initData)
		const startParam = urlParams.get('start_param')

		if (startParam && startParam.startsWith('course_')) {
			const courseId = startParam.split('_')[1]
			navigate(`/course/${courseId}`)
			setHasRedirected(true)
		} else if (startParam && startParam === 'profile') {
			navigate('/profile')
			setHasRedirected(true)
		}
	}, [navigate, hasRedirected])

	return (
		<TonConnectUIProvider manifestUrl='https://comncourse.netlify.app/tonconnect-manifest.json'>
			<div id='wrap'>
				<div id='content'>
					<div className='App'>
						<meta
							name='viewport'
							content='width=device-width, user-scalable=no'
						></meta>
						<Routes>
							<Route path={'registration'} element={<RegistrationPage />} />
							<Route index element={<Feed />} />
							<Route path={'edit-profile/:id'} element={<EditProfile />} />
							<Route
								path={'user-feedback/:id'}
								element={<FeedbackPage isFullCourses={true} />}
							/>
							<Route path={'user/:id'} element={<SellerProfile />} />
							<Route path={'wallet'} element={<Wallet />} />
							<Route path={'landing'} element={<LandingPage />} />
							<Route path={'buy-course'} element={<PaymentPage />} />
							<Route path={'legal'} element={<LegalPage />} />
							<Route
								path={'verification-form'}
								element={<VerificationForm />}
							/>
							<Route path={'connect-payments-form'} element={<ConnectCard />} />
						</Routes>
					</div>
				</div>
			</div>
		</TonConnectUIProvider>
	)
}

export default App
