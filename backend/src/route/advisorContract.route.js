import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createAdvisorContract,
  listAdvisorContracts,
  getAdvisorContract,
  generateAdvisorPdf,
  updateAdvisorStatus,
  editAdvisorContract,
  uploadAdvisorContractSignature,
  uploadAdvisorSignature,
} from '../controller/advisorContract.controller.js';
import {
  AdvisorContractCreateSchema,
  AdvisorContractStatusUpdateSchema,
  AdvisorContractEditSchema,
} from '../validators/advisorContract.validators.js';

const router = express.Router();

router.use(protect);

router.get('/', authorizeRoles(['admin', 'management', 'superadmin', 'lecturer']), listAdvisorContracts);

router.post(
  '/',
  authorizeRoles(['admin', 'superadmin']),
  validate(AdvisorContractCreateSchema, 'body'),
  createAdvisorContract
);

router.get('/:id', authorizeRoles(['admin', 'management', 'superadmin', 'lecturer']), getAdvisorContract);

// Update status (e.g., management requests redo)
router.patch(
  '/:id/status',
  authorizeRoles(['admin', 'management', 'superadmin', 'lecturer']),
  validate(AdvisorContractStatusUpdateSchema, 'body'),
  updateAdvisorStatus
);

// Edit contract details (only allowed when REQUEST_REDO)
router.patch(
  '/:id',
  authorizeRoles(['admin']),
  validate(AdvisorContractEditSchema, 'body'),
  editAdvisorContract
);

// Generate/preview advisor contract PDF
router.get(
  '/:id/pdf',
  authorizeRoles(['admin', 'management', 'superadmin', 'lecturer']),
  generateAdvisorPdf
);

// Upload e-signature (who=advisor|management)
router.post(
  '/:id/signature',
  authorizeRoles(['admin', 'lecturer', 'management', 'superadmin']),
  uploadAdvisorSignature.single('file'),
  uploadAdvisorContractSignature
);

export default router;
