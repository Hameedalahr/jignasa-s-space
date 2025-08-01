// Utility function to calculate actual resource and project counts
import { resources, projects } from '../components/DomainPage'

export const calculateDomainTotals = () => {
  const totals = {}
  
  // Calculate actual totals from the resources and projects data
  Object.keys(resources).forEach(domainId => {
    const resourceCount = resources[domainId]?.length || 0
    const projectCount = projects[domainId]?.length || 0
    
    totals[domainId] = {
      resources: resourceCount,
      projects: projectCount,
      total: resourceCount + projectCount
    }
  })
  
  return totals
}

export const getTotalResources = () => {
  const totals = calculateDomainTotals()
  return Object.values(totals).reduce((sum, domain) => sum + domain.resources, 0)
}

export const getTotalProjects = () => {
  const totals = calculateDomainTotals()
  return Object.values(totals).reduce((sum, domain) => sum + domain.projects, 0)
}

export const getTotalItems = () => {
  const totals = calculateDomainTotals()
  return Object.values(totals).reduce((sum, domain) => sum + domain.total, 0)
}

// Export the calculated totals for use in other components
export const domainTotals = calculateDomainTotals() 