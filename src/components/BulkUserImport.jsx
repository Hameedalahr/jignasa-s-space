import { useState } from 'react'
import { userManager } from '../utils/userManager'

const BulkUserImport = () => {
  const [users, setUsers] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [retrying, setRetrying] = useState(false)

  const handleBulkImport = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)
    setProgress({ current: 0, total: 0 })

    try {
      // Parse the users input
      const userList = users.split('\n').filter(line => line.trim()).map((line, index) => {
        const [username, email, password] = line.split(',').map(item => item.trim())
        return { username, email, password, index: index + 1 }
      })

      setProgress({ current: 0, total: userList.length })

      const results = []
      
      for (let i = 0; i < userList.length; i++) {
        const user = userList[i]
        setProgress({ current: i + 1, total: userList.length })
        
        try {
          const result = await userManager.addTestUser(user.email, user.password, user.username)
          results.push({ 
            user: user.email, 
            username: user.username,
            ...result 
          })
        } catch (error) {
          // Handle rate limiting specifically
          if (error.message && error.message.includes('rate limit')) {
            results.push({ 
              user: user.email, 
              username: user.username,
              success: false, 
              error: { message: 'Rate limit exceeded - will retry later' },
              needsRetry: true
            })
          } else {
            results.push({ 
              user: user.email, 
              username: user.username,
              success: false, 
              error: error 
            })
          }
        }
        
        // Increase delay to avoid rate limiting - 3 seconds between each user
        await new Promise(resolve => setTimeout(resolve, 3000))
      }

      setResults(results)
      setProgress({ current: userList.length, total: userList.length })
    } catch (error) {
      setResults([{ success: false, error: error.message }])
    } finally {
      setLoading(false)
    }
  }

  const retryFailedUsers = async () => {
    if (!results) return
    
    const failedUsers = results.filter(r => r.needsRetry)
    if (failedUsers.length === 0) return
    
    setRetrying(true)
    setProgress({ current: 0, total: failedUsers.length })
    
    const newResults = [...results]
    
    for (let i = 0; i < failedUsers.length; i++) {
      const failedUser = failedUsers[i]
      setProgress({ current: i + 1, total: failedUsers.length })
      
      try {
        // Wait 5 seconds before retrying each user
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        const result = await userManager.addTestUser(failedUser.user, failedUser.password, failedUser.username)
        
        // Update the result in the original array
        const index = newResults.findIndex(r => r.user === failedUser.user)
        if (index !== -1) {
          newResults[index] = { 
            user: failedUser.user, 
            username: failedUser.username,
            ...result 
          }
        }
      } catch (error) {
        // Update the result with the new error
        const index = newResults.findIndex(r => r.user === failedUser.user)
        if (index !== -1) {
          newResults[index] = { 
            user: failedUser.user, 
            username: failedUser.username,
            success: false, 
            error: error 
          }
        }
      }
    }
    
    setResults(newResults)
    setProgress({ current: failedUsers.length, total: failedUsers.length })
    setRetrying(false)
  }

  const generateSampleData = () => {
    const sampleUsers = []
    for (let i = 1; i <= 10; i++) {
      sampleUsers.push(`User${i},user${i}@jignasa.com,password${i}123`)
    }
    setUsers(sampleUsers.join('\n'))
  }

  const loadMemberCredentials = () => {
    const memberData = `Anil kumar,24091a3210@rgmcet.edu.in,anil@KMR#829
Kuduthuru Anusha,24091a3212@rgmcet.edu.in,anusha@KTU#514
Karnati Anusha,24091a3213@rgmcet.edu.in,anusha@KNA#733
SHAIK ASLAM BASHA,shakechanbasha30@gmail.com,aslam@SAB#902
B.Bhavya Seee,24091a3219@rgmcet.edu.in,bhavya@BBS#418
S.Chandra Mouleswari,24091a3221@rgmcet.edu.in,chandra@SCM#235
C.Charan,24091a3224@rgmcet.edu.in,charan@CCH#771
ALLU DINESH KUMAR,24091a3237@rgmcet.edu.in,dinesh@ADK#643
D.Dinesh Raj,ddineshraj122007@gmail.com,dinesh@DDR#586
SHAIK FAYAZ BASHA,24091a3241@rgmcet.edu.in,fayaz@SFB#390
A.Gnana Keerthana,24091a3244@rgmcet.edu.in,keerthana@AGK#228
D Harshitha,24091a3252@rgmcet.edu.in,harshitha@DH#931
MULLA IRSHAD,24091a3260@rgmcet.edu.in,irshad@MI#808
P.Jaya Sankar,pujalasai01@gmail.com,jaya@PJS#512
Jaya sree,jayasreepogula@gmail.com,jayasree@JS#921
KANDULA JERDEV JAYANTH KUMAR,jayanth1987bannu@gmail.com,jerdev@KJJK#447
VADDE JEEVA,24091a3268@rgmcet.edu.in,jeeva@VJ#739
C KALAVATHI,24091a3271@rgmcet.edu.in,kalavathi@CK#387
K.Mahammed Rafi,24091a3284@rgmcet.edu.in,rafi@KMR#655
Shaik Mohammad Ashraf Naik,24091a3299@rgmcet.edu.in,ashraf@SMAN#140
Basireddy praveena,24091a32c3@rgmcet.edu.in,praveena@BP#607
Revathi,24091a32d3@rgmcet.edu.in,revathi@R#519
G sahana,24091a32d8@rgmcet.edu.in,sahana@GS#324
Uttanuru supraja,24091a32h5@rgmcet.edu.in,supraja@US#872
K. Thanveer,24091a32h8@rgmcet.edu.in,thanveer@KT#618
B.Uday Kumar,24091a32h9@rgmcet.edu.in,uday@BUK#439
Vasu Rachamani,24091a32j3@rgmcet.edu.in,vasu@VR#950
Velpula Venkata Sravani,24091a32k0@rgmcet.edu.in,sravani@VVS#388
Vijaya Durga,24091a32k5@rgmcet.edu.in,durga@VD#287
Dudekula Yashmin,24091a32m0@rgmcet.edu.in,yashmin@DY#903
D.sravanthi,24091a32g5@rgmcet.edu.in,sravanthi@DS#724
Baka Chetan Sai,23091a3224@rgmcet.edu.in,chetan@BCS#734
Basireddygari Chethurvi,23091a3225@rgmcet.edu.in,chethurvi@BGC#652
Machanooru Keerthi,23091a3259@rgmcet.edu.in,keerthi@MK#209
Thathireddy Likhitha,23091a3270@rgmcet.edu.in,likhitha@TRL#981
M.Mahesh Babu,23091a3275@rgmcet.edu.in,mahesh@MMB#415
K.Maheswari,23091a3277@rgmcet.edu.in,maheswari@KM#848
P.Manjusree,23091a3283@rgmcet.edu.in,manjusree@PM#366
SURYA NAVYA SREE,23091a3297@rgmcet.edu.in,navya@SNS#572
B.Nikhitha,23091a32a0@rgmcet.edu.in,nikhitha@BN#934
Gandham Nikhitha,23091a32a1@rgmcet.edu.in,nikhitha@GN#742
G.Nithyasri reddy,23091a32a2@rgmcet.edu.in,nithyasri@GNR#658
Lachigalla Parvathi,23091a32a4@rgmcet.edu.in,parvathi@LP#793
G.Pavani,23091a32a7@rgmcet.edu.in,pavani@GP#201
Cipurapu Pragathi,23091a32a9@rgmcet.edu.in,pragathi@CP#470
Pranjal Kumar Dindayal,23091a32b1@rgmcet.edu.in,pranjal@PKD#586
Badimela Pravallika,23091a32b3@rgmcet.edu.in,pravallika@BP#931
MODIYAM PURUSHOTHAM REDDY,23091a32b5@rgmcet.edu.in,purushotham@MPR#788
SHAIK REHANA,23091a32c1@rgmcet.edu.in,rehana@SR#325
D.Rithwick,23091a32c2@rgmcet.edu.in,rithwick@DR#140
Sabiya Alamuru,23091a32c4@rgmcet.edu.in,sabiya@AA#634
V.SANTHI SWAROOP,23091a32d1@rgmcet.edu.in,swaroop@VSS#500
Venigalla Shamanth Chowdary,23091a32d6@rgmcet.edu.in,shamanth@VSC#990
Kora Sireesha,23091a32e2@rgmcet.edu.in,sireesha@KS#419
G.sowmya,23091a32e5@rgmcet.edu.in,sowmya@GS#854
Adem Sujitha,23091a32f5@rgmcet.edu.in,sujitha@AS#312
S. VISHNU PRIYA,23091a32k0@rgmcet.edu.in,vishnupriya@SVP#226
CH.Lakshmi Bhargavi,24095a3209@rgmcet.edu.in,bhargavi@CLB#776
K NITHINKUMAR REDDY,24095a3212@rgmcet.edu.in,nithinkumar@KNR#663
K.Reddy Rahul,24095a3215@rgmcet.edu.in,rahul@KRR#901
P.sai vamshi,24095a3216@rgmcet.edu.in,saivamshi@PSV#547
Udaykumar,24095a3219@rgmcet.edu.in,uday@UK#788`
    
    setUsers(memberData)
  }

  const successCount = results ? results.filter(r => r.success).length : 0
  const errorCount = results ? results.filter(r => !r.success).length : 0

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            🌌 Bulk User Import
          </h1>
          <p className="text-gray-300">
            Add multiple users for testing purposes
          </p>
        </div>

        <div className="card">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-accent mb-4">Instructions</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• Enter users in the format: <code className="bg-gray-800 px-2 py-1 rounded">username,email,password</code></p>
              <p>• One user per line</p>
              <p>• Example: <code className="bg-gray-800 px-2 py-1 rounded">John,john@example.com,password123</code></p>
              <p>• Each user will be created with a 1-second delay to avoid rate limiting</p>
            </div>
          </div>

          <form onSubmit={handleBulkImport} className="space-y-4">
            <div>
              <label htmlFor="users" className="block text-sm font-medium text-gray-300 mb-2">
                Users (one per line)
              </label>
              <textarea
                id="users"
                value={users}
                onChange={(e) => setUsers(e.target.value)}
                className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent font-mono text-sm"
                placeholder="username,email,password&#10;username2,email2@example.com,password2&#10;..."
                required
              />
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                type="button"
                onClick={generateSampleData}
                className="btn-secondary"
              >
                📝 Generate Sample Data
              </button>
              
              <button
                type="button"
                onClick={loadMemberCredentials}
                className="btn-secondary"
              >
                👥 Load Member Credentials
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? `Importing... (${progress.current}/${progress.total})` : '🚀 Import Users'}
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progress</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  ⏱️ 3-second delay between users to avoid rate limiting
                </div>
              </div>
            </div>
          )}

          {retrying && (
            <div className="mt-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Retrying Failed Users</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  ⏱️ 5-second delay between retries
                </div>
              </div>
            </div>
          )}

          {results && (
            <div className="mt-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-accent mb-4">Import Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{successCount}</div>
                    <div className="text-sm text-gray-400">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{errorCount}</div>
                    <div className="text-sm text-gray-400">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{results.length}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                </div>

                {results.filter(r => r.needsRetry).length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400">
                        ⚠️ {results.filter(r => r.needsRetry).length} users failed due to rate limiting
                      </span>
                      <button
                        onClick={retryFailedUsers}
                        disabled={retrying}
                        className="btn-secondary text-sm"
                      >
                        {retrying ? 'Retrying...' : '🔄 Retry Failed Users'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="max-h-64 overflow-y-auto">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 rounded mb-2 ${
                        result.success 
                          ? 'bg-green-900/20 border border-green-500/20 text-green-400' 
                          : result.needsRetry
                          ? 'bg-yellow-900/20 border border-yellow-500/20 text-yellow-400'
                          : 'bg-red-900/20 border border-red-500/20 text-red-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{result.username || result.user}</span>
                        <span>
                          {result.success ? '✅' : result.needsRetry ? '⏳' : '❌'}
                        </span>
                      </div>
                      {!result.success && (
                        <div className="text-xs text-gray-400 mt-1">
                          {result.error?.message || 'Failed to create user'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <a 
              href="/login" 
              className="btn-secondary"
            >
              🚀 Go to Login Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkUserImport 