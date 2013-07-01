//
//  LoginViewController.m
//  AuthDemo
//
//  Created by chronoer on 13/4/30.
//  Copyright (c) 2013年 Zencher Co., Ltd. All rights reserved.
//

#import "LoginViewController.h"
#import "AFNetworking.h"
#import "AuthViewController.h"



@interface LoginViewController ()<UITextFieldDelegate,SignDelegate>
@property (weak, nonatomic) IBOutlet UIScrollView *editingScrollView;
@property (weak, nonatomic) IBOutlet UITextField *accountField;
@property (weak, nonatomic) IBOutlet UITextField *passwordField;
@property (weak, nonatomic) IBOutlet UILabel *statusLabel;

@end

@implementation LoginViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    CGRect originalRect = self.editingScrollView.frame;
    self.editingScrollView.contentSize = originalRect.size;
    [[NSNotificationCenter defaultCenter] addObserverForName:UIKeyboardDidShowNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        CGRect endRect = [note.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
        CGRect originalRect = self.editingScrollView.frame;
        self.editingScrollView.frame = CGRectMake(originalRect.origin.x, originalRect.origin.y, originalRect.size.width, endRect.origin.y - originalRect.origin.y);
    }];
    
    [[NSNotificationCenter defaultCenter] addObserverForName:UIKeyboardWillHideNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        CGRect endRect = [note.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
        CGRect originalRect = self.editingScrollView.frame;
        self.editingScrollView.frame = CGRectMake(originalRect.origin.x, originalRect.origin.y, originalRect.size.width, endRect.origin.y - originalRect.origin.y);
    }];
	// Do any additional setup after loading the view.
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void) remoteLogin{
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
    NSURL *url = [NSURL URLWithString:[AWSServer stringByAppendingString:@"/apiLogin"]];
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"POST";
    NSDictionary * bodyDict = @{@"username": self.accountField.text, @"password": self.passwordField.text};
    NSString * paraString = [NSString stringWithFormat:@"username=%@&password=%@",bodyDict[@"username"], bodyDict[@"password"]];
    request.HTTPBody = [paraString dataUsingEncoding:NSUTF8StringEncoding];
    
    [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue new] completionHandler:^(NSURLResponse * response, NSData * data, NSError * error) {
        NSLog(@"back message");
        [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
        if (data == nil) {
            NSLog(@"Login error %@", error);
        }else{
            NSHTTPURLResponse * httpResponse = (NSHTTPURLResponse *) response;
            NSLog(@"status %d", httpResponse.statusCode);
            NSInteger statusCode = httpResponse.statusCode;
            dispatch_async(dispatch_get_main_queue(), ^{
                switch (statusCode) {
                    case 200:{
                        self.statusLabel.text = @"Successfully Logged in";
                        [self dismissViewControllerAnimated:YES completion:^{
                            [self.loginFinishDelegate loginfinish];
                        }];
                        break;
                    }
                    case 403:{
                        self.statusLabel.text = @"Invalid Usernam or Password";
                        break;
                    }
                    case 506:{
                        self.statusLabel.text = @"Waiting for validation";
                        [self validateCode:nil];
                        break;
                    }
                    default:
                        break;
                }
            });

        }
    }];
}
#pragma mark Text Field delegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    if (textField.tag == 10) {
        [textField resignFirstResponder];
        [self.passwordField becomeFirstResponder];
        CGRect visiblePass = self.passwordField.frame;
        [self.editingScrollView scrollRectToVisible:CGRectMake(visiblePass.origin.x, visiblePass.origin.y+30, visiblePass.size.width, visiblePass.size.height) animated:YES];
    }
    
    if (textField.tag == 11) {
        [self remoteLogin];
        [textField resignFirstResponder];
    }
    return YES;
}
- (IBAction)login:(id)sender {
    [self remoteLogin];
}
- (IBAction)validateCode:(id)sender {
    UIAlertView * alertView = [[UIAlertView alloc] initWithTitle:@"Validate" message:@"Please enter validation code" delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"OK", nil];
    alertView.alertViewStyle = UIAlertViewStylePlainTextInput;
    [alertView show];
}
-(void) alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    switch (buttonIndex) {
        case 0:{
            NSLog(@"Cancel");
            break;
        }
        case 1:{
            NSLog(@"Send validation code");
            NSString * validationCode = [alertView textFieldAtIndex:0].text;
            [self remoteValidateAccount:validationCode];
            break;
        }
        default:
            break;
    }
}

-(void) remoteValidateAccount:(NSString *) vCode{
    NSURL * url = [NSURL URLWithString:[AWSServer stringByAppendingFormat:@"/validate?token=%@", vCode]];
    NSURLRequest * request = [NSURLRequest requestWithURL:url];
    [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue new] completionHandler:^(NSURLResponse * response, NSData * data, NSError * error) {
        NSHTTPURLResponse * httpResponse = (NSHTTPURLResponse *) response;
        NSLog(@"status %d", httpResponse.statusCode);
        dispatch_async(dispatch_get_main_queue(), ^{
            switch (httpResponse.statusCode) {
                case 200:{
                    self.statusLabel.text = @"validation complete";
                    [self login:nil];
                    break;
                }
                case 403:{
                    self.statusLabel.text = @"invalid operation";
                    break;
                }
                case 506:{
                    self.statusLabel.text = @"internal server error";
                    break;
                }
                default:
                    break;
            }
        });
        
    }];
    
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    if ([[segue identifier] isEqualToString:@"SignUp"])
    {
        AuthViewController *avc = [segue destinationViewController];
        avc.SignFinishDelegate = self;
    }
}


-(void)signfinish:(NSDictionary *)dicWitInfo
{
    self.accountField.text = dicWitInfo[@"name"];
    self.passwordField.text = dicWitInfo[@"password"];
    [self dismissViewControllerAnimated:YES completion:^{
        [self validateCode:nil];
    }];
}


//Unwind
-(IBAction)backToLoginView:(UIStoryboardSegue *) sender{
    
}
@end
