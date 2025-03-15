import { postEvent } from '@telegram-apps/sdk'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
// import EditCourse from '../pages/Create/EditCourse'
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

		script.onload = () => {
			console.log('Telegram Web App script loaded')

			if (window.Telegram?.WebApp) {
				const webApp = window.Telegram.WebApp

				webApp.ready()

				webApp.expand()

				if (
					window.Telegram.WebView.initParams.tgWebAppPlatform !== 'tdesktop'
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
							<Route index element={<Feed />} />
						</Routes>
					</div>
				</div>
			</div>
		</TonConnectUIProvider>
	)
}

export default App
