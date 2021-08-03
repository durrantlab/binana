
/**
 * @constructor
 */
function Vue(s) {};
Vue.component = function(a,b) {};
Vue.set = function(a, b, c) {};
Vue.nextTick = function(a) {};
Vue.$slots = function(a) {};
Vue.use = function(a) {};

function Vuex() {};

/**
 * @constructor
 */
Vuex.Store = function(a) {};

Vuex.Store.commit = function() {};
Vuex.Store.dispatch = function() {};
Vue.$store = function() {};

function $3Dmol() {};
$3Dmol.SurfaceType = function() {};
$3Dmol.SurfaceType.MS = function() {};
$3Dmol.createViewer = function(a,b) {};
$3Dmol.removeAllModels = function() {};
$3Dmol.removeAllSurfaces = function() {};
$3Dmol.removeAllShapes = function() {};
$3Dmol.removeAllLabels = function() {};
$3Dmol.addBox = function(a) {};
$3Dmol.addModel = function() {};
var addModel = function() {};
$3Dmol.zoomTo = function() {};
$3Dmol.setStyle = function() {};
$3Dmol.zoom = function() {};
$3Dmol.render = function() {};
$3Dmol.removeModel = function() {};
$3Dmol.addStyle = function() {};
$3Dmol.removeSurface = function() {};
$3Dmol.addSurface = function() {};
$3Dmol.setSurfaceMaterialStyle = function() {};
$3Dmol.selectedAtoms = function() {};
$3Dmol.setBackgroundColor = function() {};
$3Dmol.setProjection = function(s) {};
$3Dmol.addLabel = function(a, b, c) {};
$3Dmol.removeAllLabels = function() {};
$3Dmol.setHoverable = function() {};
$3Dmol.setClickable = function() {};
$3Dmol.removeLabel = function(a) {};
$3Dmol.getID = function() {};
$3Dmol.addSphere = function(a) {};
$3Dmol.removeShape = function(a) {};
$3Dmol.exportVRML = function() {};

var SmilesDrawer = function(a) {};

/**
 * @constructor
 */
SmilesDrawer.Drawer = function(a) {};

SmilesDrawer.draw = function(a, b, c, d) {};
SmilesDrawer.parse = function(a, b, c) {};

/**
 * @constructor
 */
function GoldenLayout(a, b) {};

GoldenLayout._isFullPage = function() {};
GoldenLayout.prototype.registerComponent = function(a, b) {};
GoldenLayout.prototype.init = function() {};
GoldenLayout.prototype.updateSize = function() {};
GoldenLayout.prototype.on = function(a, b) {};
GoldenLayout.prototype.destroy = function() {};
GoldenLayout.prototype.toConfig = function(s) {};
GoldenLayout.prototype.root = function() {};

function GoldenLayoutItem(a, b) {};
GoldenLayoutItem.parent = function() {};
GoldenLayoutItem.parent.setActiveContentItem = function(s) {};

var jQuery;
jQuery.prototype.fileinput = function(s) {};
jQuery.Event.key = function() {};
jQuery.prototype.DataTable = function(a) {};
jQuery.prototype.draggable = function(a) {};
jQuery.prototype.makeCssInline = function() {};  /** custom added */
jQuery.prototype.slideUp = function() {};
// jQuery.prototype.modal = function(a) {};
jQuery.modal = function(a) {};
jQuery.html = function(a) {};
jQuery.removeClass = function(a) {};
jQuery.addClass = function(a) {};
jQuery.attr = function(a,b) {};
// jQuery.prototype.scrollspy = function() {};
// jQuery.prototype.scrollspy.options = function() {};
jQuery.prototype.getScript = function(a, b) {};
jQuery.append = function(a) {};
jQuery.remove = function() {};
jQuery.keypress = function(a) {};
jQuery.getJSON = function(a, b) {};
jQuery.ajax = function(a,b) {};
jQuery.hide = function() {};
jQuery.css = function(a,b) {};

function _(astr) {};
function __(astr) {};

function localStorage() {};
localStorage.getItem = function(s) {};
localStorage.setItem = function(s,t) {};

var qq = function(a) {};

/**
 * @constructor
 */
qq.FineUploader = function(a) {};
qq.FineUploader.setParams = function(a) {};
qq.FineUploader.reset = function() {}
qq.FineUploader.clearStoredFiles = function() {};

/**
 * @constructor
 */
var jsPDF = function(a, b, c) {};
jsPDF.prototype.output = function(a) {};
jsPDF.prototype.save = function(a) {};


function svg2pdf(a, b, c) {};

/**
 * @constructor
 */
var Chartist = function(a) {};

Chartist.update = function(a, b) {};
Chartist.off = function(a, b) {};
Chartist.on = function(a, b) {};
Chartist.plugins = function() {};
Chartist.plugins.ctAxisTitle = function(a) {};

var VeeValidate;

var gtag = function(a,b,c) {};

var saveAs = function(a,b) {};

/**
 * @constructor
 */
var JSZip = function() {};
JSZip.prototype.generateAsync = function(a) {};
JSZip.prototype.file = function(a, b) {};


var BABYLON;
BABYLON.OBJFileLoader = function() {};
BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
BABYLON.SceneLoader = function() {};
BABYLON.SceneLoader.LoadAssetContainerAsync = function(a,b,c) {};
BABYLON.SceneLoader.Load = function(a,b,c,d,e) {};
BABYLON.SceneLoader.LoadAssetContainer = function(a, b, c, d, e) {};
BABYLON.MeshBuilder;
BABYLON.MeshBuilder.CreateBox = function(a, b, c) {};

/**
 * @constructor
 */
BABYLON.AssetsManager = function(a) {};

BABYLON.AssetsManager.prototype.addMeshTask = function(a, b, d, c) {};
BABYLON.AssetsManager.prototype.onProgress = function(a, b, d) {};
BABYLON.AssetsManager.prototype.load = function() {};
BABYLON.MeshTask.onSuccess = function(a) {};
BABYLON.MeshTask.onFinish = function(a) {};
BABYLON.MeshTask.loadedMeshes;

/**
 * @constructor
 */
BABYLON.ShadowGenerator = function(a,b) {};

BABYLON.ShadowGenerator.prototype.setDarkness = function(a) {};
BABYLON.ShadowGenerator.prototype.useBlurExponentialShadowMap;
BABYLON.ShadowGenerator.prototype.blurScale;
BABYLON.ShadowGenerator.prototype.blurBoxOffset;
BABYLON.ShadowGenerator.prototype.getShadowMap = function() {};
BABYLON.ShadowGenerator.prototype.getShadowMap.renderList;
BABYLON.ShadowGenerator.prototype.getShadowMap.refreshRate;


/**
 * @constructor
 */
BABYLON.Color3 = function(a,b,c) {};

/**
 * @constructor
 */
BABYLON.Texture = function(a,b) {};

BABYLON.Material = function() {};
BABYLON.Material.dispose = function() {};
BABYLON.Material.ClockWiseSideOrientation = function() {};
BABYLON.Material.sideOrientation;
BABYLON.Material.diffuseColor;
BABYLON.Material.specularColor;
BABYLON.Material.emissiveTexture;
BABYLON.Material.diffuseTexture;
BABYLON.Material.emissiveColor;
BABYLON.Material.activeLight;
BABYLON.Material.alpha;
BABYLON.Material.freeze = function() {};
BABYLON.Material.albedoColor;
BABYLON.Material.backFaceCulling;
BABYLON.Material.disableLighting

BABYLON.SSAORenderingPipeline = function(a,b,c) {};

/**
 * @constructor
 */
BABYLON.ShadowOnlyMaterial = function(a,b) {};

/**
 * @constructor
 */
BABYLON.Sound = function(a,b,c,d,e) {};

BABYLON.Sound.prototype.setPosition = function(a) {};
BABYLON.Sound.prototype.play = function() {};

BABYLON.GUI = function() {};

/**
 * @constructor
 */
BABYLON.GUI.GUI3DManager = function(a) {};

BABYLON.GUI.GUI3DManager.prototype.addControl = function(a) {};
BABYLON.GUI.GUI3DManager.prototype.rootContainer;
BABYLON.GUI.GUI3DManager.prototype.rootContainer.isVisible;

/**
 * @constructor
 */
BABYLON.GUI.CylinderPanel = function() {};

BABYLON.GUI.CylinderPanel.prototype.linkToTransformNode = function(a) {};
BABYLON.GUI.CylinderPanel.prototype.addControl = function(a) {};
BABYLON.GUI.CylinderPanel.prototype.radius;
BABYLON.GUI.CylinderPanel.prototype.margin;
BABYLON.GUI.CylinderPanel.prototype.blockLayout;
BABYLON.GUI.CylinderPanel.prototype.columns;

/**
 * @constructor
 */
BABYLON.GUI.SpherePanel = function() {};

BABYLON.GUI.SpherePanel.prototype.linkToTransformNode = function(a) {};
BABYLON.GUI.SpherePanel.prototype.addControl = function(a) {};
BABYLON.GUI.SpherePanel.prototype.radius;
BABYLON.GUI.SpherePanel.prototype.margin;
BABYLON.GUI.SpherePanel.prototype.blockLayout;
BABYLON.GUI.SpherePanel.prototype.columns;

/**
 * @constructor
 */
BABYLON.GUI.TransformNode = function(a) {};

/**
 * @constructor
 */
BABYLON.GUI.StackPanel3D = function() {};

BABYLON.GUI.StackPanel3D.prototype.linkToTransformNode = function(a) {};

/**
 * @constructor
 */
BABYLON.GUI.TextBlock = function() {};

/**
 * @constructor
 */
BABYLON.GUI.HolographicButton = function(a) {};

BABYLON.GUI.HolographicButton.prototype.onPointerClickObservable = function() {};
BABYLON.GUI.HolographicButton.prototype.onPointerClickObservable.add = function(a) {};
BABYLON.GUI.HolographicButton.prototype.node = function() {};
BABYLON.GUI.HolographicButton.prototype.mesh;
BABYLON.GUI.HolographicButton.prototype.mesh.actionManager;
BABYLON.GUI.HolographicButton.prototype.node.absolutePosition = function() {};


/**
 * @constructor
 */
BABYLON.Mesh = function(a,b) {};

BABYLON.Mesh.CreateSphere = function(a,b,c,d) {};
BABYLON.Mesh.getVerticesData = function(a) {};
BABYLON.Mesh.subdivide = function() {};
BABYLON.Mesh.createOrUpdateSubmeshesOctree = function(a,b) {};
BABYLON.Mesh.ActionManager = function() {};
BABYLON.Mesh.material = function() {};
BABYLON.Mesh.freezeWorldMatrix = function() {};
BABYLON.Mesh.receiveShadows;
BABYLON.Mesh.id;
BABYLON.Mesh.hasVertexAlpha;
BABYLON.Mesh.visibility;
BABYLON.Mesh.name;
BABYLON.Mesh.isVisible;
BABYLON.Mesh.checkCollisions;
BABYLON.Mesh.useOctreeForCollisions;
BABYLON.Mesh.scaling = function() {};
BABYLON.Mesh.scaling.x = 0;
BABYLON.Mesh.scaling.y = 0;
BABYLON.Mesh.scaling.z = 0;
BABYLON.Mesh.position = function() {};
BABYLON.Mesh.position.x = 0;
BABYLON.Mesh.position.y = 0;
BABYLON.Mesh.position.z = 0;
BABYLON.Mesh.rotation = function() {};
BABYLON.Mesh.rotation.x = 0;
BABYLON.Mesh.rotation.y = 0;
BABYLON.Mesh.rotation.z = 0;
BABYLON.Mesh.simplify = function(a,b,c,d) {};
BABYLON.Mesh.dispose = function() {};
BABYLON.Mesh.getLODLevels = function() {};
BABYLON.Mesh.removeLODLevel = function(a) {};
BABYLON.Mesh.flipFaces = function(a) {};
BABYLON.Mesh.MergeMeshes = function(a,b,c) {};
BABYLON.Mesh.BACKSIDE;
BABYLON.Mesh.FRONTSIDE;
BABYLON.Mesh.DOUBLESIDE;
BABYLON.Mesh.showBoundingBox;
BABYLON.Mesh.setPivotMatrix = function(a) {};
BABYLON.Mesh.getBoundingInfo = function() {};
BABYLON.Mesh.getBoundingInfo.boundingBox;
BABYLON.Mesh.getBoundingInfo.boundingBox.maximumWorld;
BABYLON.Mesh.getBoundingInfo.boundingBox.minimumWorld;
BABYLON.Mesh.getBoundingInfo.boundingBox.centerWorld;
BABYLON.Mesh.refreshBoundingInfo = function() {};
BABYLON.Mesh.animations;
BABYLON.Mesh.getWorldMatrix = function() {};
BABYLON.Mesh.infiniteDistance;

BABYLON.Matrix;
BABYLON.Matrix.Translation = function(a) {};


/**
 * @constructor
 */
BABYLON.HemisphericLight = function(a,b,c) {};

/**
 * @constructor
 */
BABYLON.PointLight = function(a,b,c) {};

/**
 * @constructor
 */
BABYLON.Vector3 = function(a,b,c) {};

BABYLON.Vector3.Distance = function(a,b) {};
BABYLON.Vector3.subtract = function(a) {};
BABYLON.Vector3.clone = function() {};
BABYLON.Vector3.prototype.clone = function() {};
BABYLON.Vector3.add = function(a) {};
BABYLON.Vector3.copyFrom = function(a) {};
BABYLON.Vector3.normalize = function() {};
BABYLON.Vector3.equals = function(a) {};
BABYLON.Vector3.scale = function(a) {};
BABYLON.Vector3.x = 0;
BABYLON.Vector3.y = 0;
BABYLON.Vector3.z = 0;
BABYLON.Vector3.GetAngleBetweenVectors = function(a,b,c) {};
BABYLON.Vector3.normalizeFromLength = function(a) {};
BABYLON.Vector3.Zero = function() {};
BABYLON.Vector3.equalsToFloats = function(a,b,c) {};
BABYLON.Vector3.TransformCoordinates = function(a,b) {};
BABYLON.Vector3.asArray = function() {};
BABYLON.Vector3.FromArray = function(a) {};

/**
 * @constructor
 */
BABYLON.StandardMaterial = function(a,b) {};

/**
 * @constructor
 */
BABYLON.Engine = function(a,b) {};

BABYLON.Engine.prototype.runRenderLoop = function(a) {};
BABYLON.Engine.prototype.resize = function() {};
BABYLON.Engine.prototype.enableOfflineSupport;
BABYLON.Engine.prototype.switchFullscreen = function(a) {};
BABYLON.Engine.prototype.displayLoadingUI = function() {};
BABYLON.Engine.prototype.hideLoadingUI = function() {};
BABYLON.Engine.prototype.loadingUIText;
BABYLON.Engine.prototype.getFps = function() {};

var require = function(a) {};

/**
 * @constructor
*/
BABYLON.FreeCamera = function(a,b,c) {};

/**
 * @constructor
*/
BABYLON.DeviceOrientationCamera = function(a,b,c,d) {};

/**
 * @constructor
 */
BABYLON.Scene = function(a) {};

BABYLON.Scene.prototype.executeWhenReady = function(a) {};
BABYLON.Scene.prototype.activeCamera = function() {};
BABYLON.Scene.prototype.activeCamera.attachControl = function(a) {};
BABYLON.Scene.prototype.activeCamera._updatePosition = function() {};
BABYLON.Scene.prototype.activeCamera.getForwardRay = function() {};
BABYLON.Scene.prototype.activeCamera.leftCamera;
BABYLON.Scene.prototype.activeCamera.rightCamera;
BABYLON.Scene.prototype.activeCamera.leftCamera.globalPosition;
BABYLON.Scene.prototype.activeCamera.rightCamera.globalPosition;
BABYLON.Scene.prototype.activeCamera.animations;
BABYLON.Scene.prototype.activeCamera.keysUp;
BABYLON.Scene.prototype.activeCamera.keysDown;
BABYLON.Scene.prototype.activeCamera.keysLeft;
BABYLON.Scene.prototype.activeCamera.keysRight;
BABYLON.Scene.prototype.activeCamera.applyGravity;
BABYLON.Scene.prototype.activeCamera.checkCollisions;
BABYLON.Scene.prototype.activeCamera.speed;
BABYLON.Scene.prototype.activeCamera.ellipsoid;
BABYLON.Scene.prototype.activeCamera.minZ;
BABYLON.Scene.prototype.activeCamera.maxZ;
BABYLON.Scene.prototype.activeCamera.inputs;
BABYLON.Scene.prototype.activeCamera.inputs.attached;
BABYLON.Scene.prototype.activeCamera.inputs.attached.deviceOrientation;
BABYLON.Scene.prototype.activeCamera.inputs.attached.deviceOrientation._alpha;
BABYLON.Scene.prototype.activeCamera.inputs.attached.deviceOrientation._beta;
BABYLON.Scene.prototype.activeCamera.inputs.attached.deviceOrientation._gamma;
BABYLON.Scene.prototype.activeCamera.resetToCurrentRotation = function() {};
BABYLON.Scene.prototype.activeCamera.setTarget = function(a) {};
BABYLON.Scene.prototype.activeCamera.inputs;
BABYLON.Scene.prototype.activeCamera.inputs.clear = function() {};
BABYLON.Scene.prototype.lights = function() {};
BABYLON.Scene.prototype.lights.name = function() {};
BABYLON.Scene.prototype.lights.dispose = function() {};
BABYLON.Scene.prototype.lights.autoUpdateExtends;
BABYLON.Scene.prototype.meshes = function() {};
BABYLON.Scene.prototype.getMeshByName = function(a) {};
BABYLON.Scene.prototype.getMeshByID = function(a) {};
BABYLON.Scene.prototype.beginAnimation = function(a,b,c,d,e,f) {};
BABYLON.Scene.prototype.registerBeforeRender = function(a) {};
BABYLON.Scene.prototype.pickWithRay = function(a,b) {};
BABYLON.Scene.prototype.pickWithRay.hit;
BABYLON.Scene.prototype.pickWithRay.distance;
BABYLON.Scene.prototype.pickWithRay.pickedPoint;
BABYLON.Scene.prototype.pickWithRay.pickedMesh;
BABYLON.Scene.prototype.createDefaultVRExperience = function() {};
BABYLON.Scene.prototype.render = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.rightControllerGazeTrackerMesh;
BABYLON.Scene.prototype.createDefaultVRExperience.leftControllerGazeTrackerMesh;
BABYLON.Scene.prototype.createDefaultVRExperience.gazeTrackerMesh;
BABYLON.Scene.prototype.createDefaultVRExperience.enableGazeEvenWhenNoPointerLock;
BABYLON.Scene.prototype.createDefaultVRExperience.gazeTrackerMesh.isVisible;
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera;
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.deviceRotationQuaternion;
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllerMeshLoadedObservable = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllerMeshLoadedObservable.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllerMeshLoaded = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllerMeshLoaded.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllersAttachedObservable = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.onControllersAttachedObservable.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.rotationQuaternion;
BABYLON.Scene.prototype.createDefaultVRExperience.webVRCamera.rotationQuaternion.toEulerAngles = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.teleportCamera = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.exitVR = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience._fullscreenVRpresenting;
BABYLON.Scene.prototype.createDefaultVRExperience.currentVRCamera;
BABYLON.Scene.prototype.createDefaultVRExperience.currentVRCamera.initControllers = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.currentVRCamera.controllers;
BABYLON.Scene.prototype.getEngine = function() {};
BABYLON.Scene.prototype.getEngine.getCaps = function() {};
BABYLON.Scene.prototype.getEngine.getCaps.multiview;
BABYLON.Scene.prototype.getEngine.exitFullscreen = function() {};
BABYLON.Scene.prototype.WebVRController;
BABYLON.Scene.prototype.WebVRController.onTriggerStateChangedObservable = function() {};
BABYLON.Scene.prototype.WebVRController.onTriggerStateChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.WebVRController.onPadStateChangedObservable = function() {};
BABYLON.Scene.prototype.WebVRController.onPadStateChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.WebVRController.onPadValuesChangedObservable = function() {};
BABYLON.Scene.prototype.WebVRController.onPadValuesChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.debugLayer;
BABYLON.Scene.prototype.debugLayer.show = function() {};
BABYLON.Scene.prototype.WebVRController.onMainButtonStateChangedObservable= function() {};
BABYLON.Scene.prototype.WebVRController.onMainButtonStateChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.WebVRController.onSecondaryButtonStateChangedObservable= function() {};
BABYLON.Scene.prototype.WebVRController.onSecondaryButtonStateChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.WebVRController.onMenuButtonStateChangedObservable= function() {};
BABYLON.Scene.prototype.WebVRController.onMenuButtonStateChangedObservable.add = function(a) {};
BABYLON.Scene.prototype.WebVRController.pad;
BABYLON.Scene.prototype.createDefaultVRExperience.onEnteringVRObservable = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.onEnteringVRObservable.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.onExitingVRObservable = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.onExitingVRObservable.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.onAfterEnteringVRObservable = function() {};
BABYLON.Scene.prototype.createDefaultVRExperience.onAfterEnteringVRObservable.add = function(a) {};
BABYLON.Scene.prototype.createDefaultVRExperience.raySelectionPredicate;
BABYLON.Scene.prototype.createDefaultVRExperience.updateGazeTrackerScale;
BABYLON.Scene.prototype.createDefaultVRExperience.displayGaze;
BABYLON.Scene.prototype.createDefaultVRExperience.isInVRMode;
BABYLON.Scene.prototype.createDefaultVRExperience.enableInteractions = function() {};
BABYLON.Scene.prototype.collisionsEnabled;
BABYLON.Scene.prototype.autoClear;
BABYLON.Scene.prototype.autoClearDepthAndStencil;
BABYLON.Scene.prototype.gravity;
BABYLON.Scene.addAllToScene = function() {};
BABYLON.Scene.getAnimationRatio = function() {};
BABYLON.Scene.cameras;

BABYLON.Database.IDBStorageEnabled;
BABYLON.Database;

/**
 * @constructor
 */
BABYLON.SceneOptimizerOptions = function(a,b) {};
BABYLON.SceneOptimizerOptions.prototype.optimizations;
BABYLON.SceneOptimizerOptions.prototype.optimizations.push = function(a) {};

/**
 * @constructor
 */
BABYLON.QuadraticErrorSimplification = function(a) {};

BABYLON.SimplificationType;
BABYLON.SimplificationType.QUADRATIC;

/**
 * @constructor
 */
BABYLON.MergeMeshesOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.ShadowsOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.LensFlaresOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.PostProcessesOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.ParticlesOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.TextureOptimization = function(a, b) {};

/**
 * @constructor
 */
BABYLON.RenderTargetsOptimization = function(a) {};

/**
 * @constructor
 */
BABYLON.HardwareScalingOptimization = function(a, b) {};

/**
 * @constructor
 */
BABYLON.Animation = function(a,b,c,d,e) {};

BABYLON.Animation.ANIMATIONTYPE_VECTOR3 = function() {};
BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT = function() {};
BABYLON.SceneOptimizer = function() {};
BABYLON.SceneOptimizer.OptimizeAsync = function(a,b) {};
BABYLON.SceneOptimizerOptions.HighDegradationAllowed = function() {};
BABYLON.VertexBuffer = function() {};
BABYLON.VertexBuffer.PositionKind = function() {};
BABYLON.RenderTargetTexture = function() {};
BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE = function() {};
BABYLON.Animation.prototype.setKeys = function(a) {};
BABYLON.Animation.ANIMATIONTYPE_FLOAT;
BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;


/**
 * @constructor
 */
BABYLON.ActionManager = function(a) {};

BABYLON.ActionManager.OnPickTrigger = function() {};
BABYLON.ActionManager.NothingTrigger = function() {};
BABYLON.ActionManager.prototype.registerAction = function(a) {};

BABYLON.InterpolateValueAction = function(a,b,c,d,e) {};

/**
 * @constructor
 */
BABYLON.ExecuteCodeAction = function(a,b) {};

/**
 * @constructor
 * @param {*} a
 * @param {*} b
 * @param {number=} c
 */
BABYLON.Ray = function(a,b,c) {};

/**
 * @constructor
 */
BABYLON.VertexData = function() {};

BABYLON.VertexData.prototype.applyToMesh = function(a) {};
BABYLON.VertexData.prototype.ComputeNormals = function(a,b,c) {};
BABYLON.VertexData.ComputeNormals = function(a,b,c) {};

BABYLON.Quaternion;
BABYLON.Quaternion.FromEulerAngles = function(a, b, c) {};
BABYLON.Quaternion.FromEulerVector = function(a) {};
BABYLON.Quaternion.asArray = function() {};
BABYLON.Quaternion.FromArray = function(a) {};
BABYLON.Quaternion.x;
BABYLON.Quaternion.y;
BABYLON.Quaternion.z;
BABYLON.Quaternion.w;

var annyang = function() {};
annyang.addCommands = function(a) {};
annyang.removeCommands = function() {};
annyang.start = function() {};
annyang.debug = function() {};
annyang.abort = function() {};
annyang.addCallback = function(a, b) {};

/**
 * @constructor
 */
function Fuse() {};

Fuse.prototype.search = function(a) {};

/**
 * @constructor
 */
// var SpeechSynthesisUtterance = function(a) {};

// SpeechSynthesisUtterance(a) {};
// SpeechSynthesisUtterance.prototype.rate;
// SpeechSynthesisUtterance.prototype.voice;
// SpeechSynthesisUtterance.prototype.lang;
// SpeechSynthesisUtterance.prototype.volume;

// function speechSynthesis() {};
// speechSynthesis.getVoices = function() {};
// speechSynthesis.onvoiceschanged = function() {};
// speechSynthesis.speak = function(a) {};

var MSStream;

/**
 * @constructor
 */
var Peer = function(a,b) {};

// var webpackJsonp;

var ga = function(a,b,c) {};

var BootstrapVue;

var Webina;
Webina.start = function(a) {}

// var WebAssembly;

WebAssembly.instantiate;

/**
 * @constructor
 */
WebAssembly.Module = function(a) {};

/**
 * @constructor
 */
WebAssembly.Instance = function(a) {};
