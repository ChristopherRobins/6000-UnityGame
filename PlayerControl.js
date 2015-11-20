#pragma strict

public var animSpeed : float = 1.5f;
public var lookSmoother : float = 3.0f;
public var useCurves : boolean = true;
public var useCurvesHeight : float = 0.5f;
public var forwardSpeed : float = 7.0f;
public var backwardSpeed : float = 2.0f;
public var rotateSpeed : float = 2.0f;
public var jumpPower : float = 3.0f;
private var col : CapsuleCollider;
private var rb : Rigidbody;
private var velocity : Vector3;
private var orgColHeight : float;
private var orgVectColCenter : Vector3;
private var anim : Animator;
private var currentBaseState : AnimatorStateInfo;
private var cameraObject : GameObject;
static var idleState : int = Animator.StringToHash('Base Layer.Idle');
static var locoState : int = Animator.StringToHash('Base Layer.Locomotion');
static var jumpState : int = Animator.StringToHash('Base Layer.Jump');
static var restState : int = Animator.StringToHash('Base Layer.Rest');
static var kickState : int = Animator.StringToHash('Base Layer.Kick');

function Start () {
  anim = GetComponent('Animator');
  col = GetComponent('CapsuleCollider');
  rb = GetComponent('Rigidbody');
  cameraObject = GameObject.FindWithTag('MainCamera');
  orgColHeight = col.height;
  orgVectColCenter = col.center;
}

function FixedUpdate () {
  var h : float = Input.GetAxis("Horizontal");
  var v : float = Input.GetAxis("Vertical");
  anim.SetFloat("Speed", v);
  anim.SetFloat("Direction", h);
  anim.speed = animSpeed;
  currentBaseState = anim.GetCurrentAnimatorStateInfo(0);
  rb.useGravity = true;

  velocity = new Vector3(0, 0, v);
  velocity = transform.TransformDirection(velocity);

  if (v > 0.1) {
		velocity *= forwardSpeed;
    anim.SetBool("Kick", false);
  } else if (v < -0.1) {
		velocity *= backwardSpeed;
    anim.SetBool("Kick", false);
  }

  if (Input.GetButtonDown("Jump")) {
    if(!anim.IsInTransition(0)) {
      rb.AddForce(Vector3.up * jumpPower, ForceMode.VelocityChange);
			anim.SetBool("Jump", true);
      anim.SetBool("Kick", false);
    }
  }

  transform.localPosition += velocity * Time.fixedDeltaTime;
  transform.Rotate(0, h * rotateSpeed, 0);

  if (currentBaseState.nameHash == locoState) {
    if (useCurves){
			resetCollider();
		}
  } else if(currentBaseState.nameHash == jumpState) {
    if(!anim.IsInTransition(0)) {
      if(useCurves) {
				var jumpHeight : float = anim.GetFloat("JumpHeight");
				var gravityControl : float = anim.GetFloat("GravityControl");

				if(gravityControl > 0) {
          rb.useGravity = false;
        }

        var ray : Ray = new Ray(transform.position + Vector3.up, -Vector3.up);
        var hitInfo : RaycastHit = new RaycastHit();

        if(Physics.Raycast(ray, hitInfo)) {
          if (hitInfo.distance > useCurvesHeight) {
            col.height = orgColHeight - jumpHeight;
						var adjCenterY : float = orgVectColCenter.y + jumpHeight;
						col.center = new Vector3(0, adjCenterY, 0);
          } else {
            resetCollider();
          }
        }
      }
      anim.SetBool("Jump", false);
    }
  } else if(currentBaseState.nameHash == idleState) {
    if (!anim.IsInTransition(0)) {
      if (Input.GetButtonDown("Attack")) {
        anim.SetBool("Kick", true);
        anim.SetBool("Jump", false);
      }
    }
  } else if(currentBaseState.nameHash == kickState) {
    anim.SetBool("Kick", false);
  }
}

function resetCollider() {
  col.height = orgColHeight;
  col.center = orgVectColCenter;
}
